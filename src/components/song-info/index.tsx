import { Loader, LoadingOverlay } from "@mantine/core";
import { IconDots, IconVolume, IconVolume2 } from "@tabler/icons";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import { AudioQualityType, genAudioPlayerCommand, PlayState } from "../../api";
import {
	useAlbumImageUrl,
	useConfigValue,
	useConfigValueBoolean,
} from "../../api/react";
import {
	musicIdAtom,
	songArtistsAtom,
	songNameAtom,
	playProgressAtom,
	currentAudioDurationAtom,
	playVolumeAtom,
	playStateAtom,
	currentAudioQualityTypeAtom,
	currentPlayModeAtom,
	currentAudioIdAtom,
	topbarMenuOpenedAtom,
	albumAtom,
} from "../../core/states";
import { LyricPlayerFMControls } from "../lyric-player-fm-controls";

import IconPause from "../../assets/icon_pause.svg";
import IconRewind from "../../assets/icon_rewind.svg";
import IconForward from "../../assets/icon_forward.svg";
import IconShuffle from "../../assets/icon_shuffle.svg";
import IconShuffleOn from "../../assets/icon_shuffle_on.svg";
import IconRepeat from "../../assets/icon_repeat.svg";
import IconRepeatOn from "../../assets/icon_repeat_on.svg";
import IconPlay from "../../assets/icon_play.svg";
import IconLossless from "../../assets/icon_lossless.svg";
import IconDolbyAtmos from "../../assets/icon_dolby_atmos.svg";
import { PlayMode, switchPlayMode } from "../../utils";

function toDuration(duration: number) {
	const isRemainTime = duration < 0;

	const d = Math.abs(duration | 0);
	const sec = d % 60;
	const min = Math.floor((d - sec) / 60);
	const secText = "0".repeat(2 - sec.toString().length) + sec;

	return `${isRemainTime ? "-" : ""}${min}:${secText}`;
}

const AudioFFTControl: React.FC = () => {
	const [fftData, setFFTData] = React.useState((): number[] =>
		new Array(128).fill(0),
	);

	React.useLayoutEffect(() => {
		let stopped = false;
		let scale = 20;

		function onFrame() {
			if (stopped || !betterncm.isMRBNCM) return;
			let data = betterncm_native?.audio?.getFFTData(64) ?? [];

			setFFTData((oldData) => {
				const maxValue = data.reduce((pv, cv) => (cv > pv ? cv : pv), 0);

				scale = (scale * 5 + maxValue) / 6;

				return data.map((v, i) => ((oldData[i] ?? 0) + v / scale) / 2);
			});

			requestAnimationFrame(onFrame);
		}

		onFrame();

		return () => {
			stopped = true;
		};
	}, []);

	return (
		<div className="am-audio-fft">
			{fftData.map((v, i) => (
				<div
					key={`fft-${i}`}
					style={{
						height: `${v * 100}%`,
					}}
				/>
			))}
		</div>
	);
};

export const PlayerSongInfo: React.FC<{
	isFM?: boolean;
}> = (props) => {
	const [currentPlayMode, setCurrentPlayMode] = useAtom(currentPlayModeAtom);
	const currentAudioQualityType = useAtomValue(currentAudioQualityTypeAtom);
	const currentAudioId = useAtomValue(currentAudioIdAtom);
	const musicId = useAtomValue(musicIdAtom);
	const songName: string = useAtomValue(songNameAtom);
	const album = useAtomValue(albumAtom);
	const songArtists = useAtomValue(songArtistsAtom);
	const currentAudioDuration = useAtomValue(currentAudioDurationAtom) / 1000;
	const playProgress = useAtomValue(playProgressAtom);
	const playVolume = useAtomValue(playVolumeAtom);
	const playState = useAtomValue(playStateAtom);
	const albumImageUrl = useAlbumImageUrl(musicId, 64, 64);
	const setMenuOpened = useSetAtom(topbarMenuOpenedAtom);

	const hideAlbumImage = useConfigValueBoolean("hideAlbumImage", false);
	const hideMusicName = useConfigValueBoolean("hideMusicName", false);
	const hideMusicArtists = useConfigValueBoolean("hideMusicArtists", false);
	const hideMusicAlbum = useConfigValueBoolean("hideMusicAlbum", false);
	const hideMenuButton = useConfigValueBoolean("hideMenuButton", false);
	const hidePlayProgressBar = useConfigValueBoolean(
		"hidePlayProgressBar",
		false,
	);
	const hideAudioQualityTag = useConfigValueBoolean(
		"hideAudioQualityTag",
		false,
	);

	const widgetUnderProgressBar = useConfigValue(
		"widgetUnderProgressBar",
		"play-controls",
	);

	const playProgressText = toDuration(playProgress);
	const remainText = toDuration(playProgress - currentAudioDuration);

	return (
		<>
			{!(hideAlbumImage && hideMusicName && hideMusicArtists) && (
				<div
					className="am-player-song-info"
					onContextMenu={(evt) => {
						setMenuOpened(true);
						evt.preventDefault();
					}}
				>
					<div className="am-music-info-spacer" />
					{!hideAlbumImage && (
						<div className="am-album-image">
							<div>
								<LoadingOverlay
									loader={
										<Loader
											size={50}
											style={{
												width: "50px",
												height: "50px",
											}}
										/>
									}
									sx={{
										borderRadius: "3%",
									}}
									visible={albumImageUrl.length === 0}
								/>
								<img
									alt="专辑图片"
									src={albumImageUrl}
									style={{
										opacity: albumImageUrl.length > 0 ? 1 : 0,
									}}
								/>
							</div>
						</div>
					)}
					<div className="am-music-sub-widget">
						{!hideAudioQualityTag && (
							<div className="am-music-quality">
								{currentAudioQualityType === AudioQualityType.Lossless && (
									<div className="am-music-quality-tag">
										<IconLossless />
										无损
									</div>
								)}
								{currentAudioQualityType === AudioQualityType.HiRes && (
									<div className="am-music-quality-tag">
										<IconLossless />
										高解析度无损
									</div>
								)}
								{currentAudioQualityType === AudioQualityType.DolbyAtmos && (
									<div>
										<IconDolbyAtmos />
									</div>
								)}
							</div>
						)}
						<div className="am-music-info-with-menu">
							<div className="am-music-info">
								{!hideMusicName &&
									(hideMusicAlbum || songName !== album.name) && (
										<div className="am-music-name">{songName}</div>
									)}
								{!hideMusicAlbum && (
									<div className="am-music-album">
										<a href={`#/m/album/?id=${album.id}`}>{album.name}</a>
									</div>
								)}
								<div className="am-music-artists">
									<div className="am-artists">
										{songArtists.map((artist, index) => (
											<a
												href={`#/m/artist/?id=${artist.id}`}
												key={`${artist.id}-${artist.name}-${index}`}
											>
												{artist.name}
											</a>
										))}
									</div>
								</div>
							</div>
							{!hideMenuButton && (
								<button
									className="am-music-main-menu"
									onClick={() => setMenuOpened(true)}
								>
									<IconDots color="#FFFFFF" />
								</button>
							)}
							{props.isFM && <LyricPlayerFMControls />}
						</div>

						{!hidePlayProgressBar && (
							<div className="am-music-progress-control">
								{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<div
									className="am-music-progress-bar"
									onClick={(evt) => {
										const rect = evt.currentTarget.getBoundingClientRect();
										const pos = (evt.clientX - rect.left) / rect.width;
										legacyNativeCmder._envAdapter.callAdapter(
											"audioplayer.seek",
											() => {},
											[
												currentAudioId,
												genAudioPlayerCommand(currentAudioId, "seek"),
												pos * currentAudioDuration,
											],
										);
									}}
								>
									<div
										style={{
											width: `${(playProgress / currentAudioDuration) * 100}%`,
										}}
									/>
								</div>
								<div className="am-music-progress-tips">
									<div>{playProgressText}</div>
									<div>{remainText}</div>
								</div>
							</div>
						)}
					</div>

					{widgetUnderProgressBar === "play-controls" && (
						<div className="am-music-controls">
							<button
								className="am-music-track-shuffle"
								onClick={() => {
									if (currentPlayMode === PlayMode.Random) {
										switchPlayMode(PlayMode.Order);
										setCurrentPlayMode(PlayMode.Order);
									} else {
										switchPlayMode(PlayMode.Random);
										setCurrentPlayMode(PlayMode.Random);
									}
								}}
							>
								{currentPlayMode === PlayMode.Random ? (
									<IconShuffleOn color="#FFFFFF" />
								) : (
									<IconShuffle color="#FFFFFF" />
								)}
							</button>
							<button
								className="am-music-track-prev"
								onClick={() => {
									document
										.querySelector<HTMLButtonElement>("#main-player .btnc-prv")
										?.click();
								}}
							>
								<IconRewind color="#FFFFFF" />
							</button>
							<button
								className="am-music-play"
								onClick={() => {
									if (playState === PlayState.Playing) {
										document
											.querySelector<HTMLButtonElement>(
												"#main-player .btnp-pause",
											)
											?.click();
									} else {
										document
											.querySelector<HTMLButtonElement>(
												"#main-player .btnp-play",
											)
											?.click();
									}
								}}
							>
								{playState === PlayState.Playing ? (
									<IconPause color="#FFFFFF" />
								) : (
									<IconPlay color="#FFFFFF" />
								)}
							</button>
							<button
								className="am-music-track-next"
								onClick={() => {
									document
										.querySelector<HTMLButtonElement>("#main-player .btnc-nxt")
										?.click();
								}}
							>
								<IconForward color="#FFFFFF" />
							</button>
							<button
								className="am-music-track-repeat"
								onClick={() => {
									if (currentPlayMode === PlayMode.Repeat) {
										switchPlayMode(PlayMode.Order);
										setCurrentPlayMode(PlayMode.Order);
									} else {
										switchPlayMode(PlayMode.Repeat);
										setCurrentPlayMode(PlayMode.Repeat);
									}
								}}
							>
								{currentPlayMode === PlayMode.Repeat ? (
									<IconRepeatOn color="#FFFFFF" />
								) : (
									<IconRepeat color="#FFFFFF" />
								)}
							</button>
						</div>
					)}

					{widgetUnderProgressBar === "play-controls" && (
						<div className="am-music-volume-controls">
							<IconVolume2 color="#FFFFFF" />
							{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className="am-music-volume-bar"
								onClick={(evt) => {
									const rect = evt.currentTarget.getBoundingClientRect();
									const pos = (evt.clientX - rect.left) / rect.width;
									legacyNativeCmder._envAdapter.callAdapter(
										"audioplayer.setVolume",
										() => {},
										["", "", pos],
									);
								}}
							>
								<div style={{ width: `${playVolume * 100}%` }} />
							</div>
							<IconVolume color="#FFFFFF" />
						</div>
					)}

					{widgetUnderProgressBar === "audio-viz-fft" && <AudioFFTControl />}

					<div className="am-music-info-bottom-spacer" />
				</div>
			)}
		</>
	);
};
