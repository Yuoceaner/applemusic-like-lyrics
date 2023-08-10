/**
 * @fileoverview
 * 用于以一个统一的接口来获取相关的音乐播放信息，并提供一些事件的回调操作
 */

import { TypedEventTarget } from "typescript-event-target";

export enum PlayState {
	Playing = "playing",
	Pausing = "pausing",
}

export enum AudioQualityType {
	// 128
	Normal = "normal",
	// 320
	High = "high",
	// 999
	Lossless = "lossless",
	// 1999
	HiRes = "hires",
	DolbyAtmos = "dolbyatmos",
	Local = "local",
}

export enum PlayMode {
    Order = "type-order", // playonce 顺序播放
    Repeat = "type-repeat", // playorder 列表循环
    AI = "type-ai", // mode2 = true 心动模式
    One = "type-one", // playcycle 单曲循环
    Random = "type-random", // playrandom 随机播放
}

export interface Artist {
	name: string;
	id: string;
}

/**
 * 音乐播放信息获取器的抽象
 *
 * 可以通过挂载部分事件来获得当前播放状态
 */
export abstract class MusicContextBase extends TypedEventTarget<MusicStatusGetterEvents> {
	abstract getMusicId(): string;
	abstract getMusicDuration(): number;
	abstract getMusicName(): string;
	abstract getMusicArtists(): Artist[];
    abstract getMusicQuality(): AudioQualityType;
	abstract getMusicCoverImage(): string;
	abstract getPlayState(): PlayState;
    abstract getPlayMode(): PlayMode;
    abstract setPlayMode(playMode: PlayMode): void;
    abstract seekToPosition(timeMS: number): void;
    abstract forwardSong(): void;
    abstract rewindSong(): void;
    abstract setVolume(value: number): void;
    abstract getVolume(): number;
    abstract pause(): void;
    abstract resume(): void;
	dispose(): void {}
}

export interface MusicStatusGetterEvents {
	/**
	 * 当音乐被加载时触发
	 *
	 * 此时应当可以获取被加载的音乐信息
	 */
	load: Event;
	/**
	 * 当音乐被卸载时触发
	 *
	 * 此时一般处于将要切歌或播放完毕的状态
	 */
	unload: Event;
	/**
	 * 当音乐恢复播放时触发
	 */
	resume: Event;
	/**
	 * 当音乐暂停播放时触发
	 */
	pause: Event;
	/**
	 * 当当前播放进度发生变化时触发
	 *
	 * 在 Windows 上，这个的触发频率在 60hz 左右
	 *
	 * 在 macOS 上，这个的触发频率在 2hz 左右，但是会被补间到 60hz
	 */
	progress: CustomEvent<{
		/**
		 * 当前播放进度
		 */
		progress: number;
	}>;
	/**
	 * 当音乐对应的封面图链接更新时触发
	 *
	 * 此时调用 `getMusicCoverImage` 应当会获得一个能够稳定访问到歌曲封面图片数据的链接
	 */
	"album-updated": Event;
    /**
     * 当播放音量更新时触发
     *
     * 音量大小取值范围在 [0.0-1.0] 之间
     */
    volume: CustomEvent<{
        volume: number
    }>
}