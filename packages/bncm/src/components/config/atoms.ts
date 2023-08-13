import manifest from "virtual:bncm-plugin-manifest";
import { PlayControlButtonType } from "../song-info/play-control-button";
import { atomWithConfig } from "./atom-with-config";


export const updateBranchAtom = atomWithConfig({
	key: "update-branch",
	default: manifest.branch,
	desc: "更新插件所对应检查的分支名称，main 为主分支版本",
});

export const enableUpdateBranchAtom = atomWithConfig({
	key: "enable-update-branch",
	default: false,
	desc: "是否检查其他分支更新",
});

export const enableUpdateCheckAtom = atomWithConfig({
	key: "update-check",
	default: false,
	desc: "是否在每次启动插件时检查插件更新",
});

export const showAudioQualityTagAtom = atomWithConfig({
	key: "show-audio-quality-tag",
	default: true,
	desc: "是否显示音质标签",
});

export const showAlbumImageAtom = atomWithConfig({
	key: "show-album-image",
	default: true,
	desc: "显示专辑图片",
});

export const showMusicNameAtom = atomWithConfig({
	key: "show-music-name",
	default: true,
	desc: "显示歌曲名称",
});

export const showAlbumNameAtom = atomWithConfig({
	key: "show-album-name",
	default: false,
	desc: "显示专辑名称",
});

export const showMusicArtistsAtom = atomWithConfig({
	key: "show-music-artists",
	default: true,
	desc: "显示歌手名称",
});

export const showMenuButtonAtom = atomWithConfig({
	key: "show-menu-button",
	default: true,
	desc: "显示菜单按钮",
});

export const showControlThumbAtom = atomWithConfig({
	key: "show-control-thumb",
	default: true,
	desc: "显示控制横条",
});

export const leftControlButtonTypeAtom = atomWithConfig({
	key: "left-control-button-type",
	default: PlayControlButtonType.PlaybackRandom,
	desc: "当使用播放控制栏时，左侧的按钮操作类型",
});

export const rightControlButtonTypeAtom = atomWithConfig({
	key: "right-control-button-type",
	default: PlayControlButtonType.PlaybackRepeat,
	desc: "当使用播放控制栏时，右侧的按钮操作类型",
});

export const showTranslatedLineAtom = atomWithConfig({
	key: "show-translated-line",
	default: true,
	desc: "是否显示翻译歌词行",
});
export const showRomanLineAtom = atomWithConfig({
	key: "show-roman-line",
	default: true,
	desc: "是否显示音译歌词行",
});

export const swapTranslatedRomanLineAtom = atomWithConfig({
	key: "swap-trans-roman-line",
	default: false,
	desc: "是否交换翻译行和音译行的位置",
});

export const lyricBlurEffectAtom = atomWithConfig({
	key: "lyric-blur-effect",
	default: true,
	desc: "是否应用歌词行的模糊效果",
});
export const lyricScaleEffectAtom = atomWithConfig({
	key: "lyric-scale-effect",
	default: true,
	desc: "是否应用歌词行的缩放效果",
});

export const lyricHidePassedAtom = atomWithConfig({
	key: "lyric-hide-passed",
	default: false,
	desc: "是否隐藏当前进度之后播放完成的歌词行，而不是降低不透明度",
});

export const neverGonnaGiveYouUpAtom = atomWithConfig({
	key: "never-gonna-give-you-up",
	default: false,
	desc: "不再显示开发警告",
});

export const showTutoialAtom = atomWithConfig({
	key: "show-tutoial",
	default: true,
	desc: "显示使用教程",
});

export const enableWSPlayer = atomWithConfig({
	key: "enable-ws-player",
	default: false,
	desc: "是否启用歌词播放器连接",
});
export const wsPlayerURL = atomWithConfig({
	key: "ws-player-url",
	default: "ws://localhost:11444",
	desc: "将会连接到的歌词播放器的地址",
});

