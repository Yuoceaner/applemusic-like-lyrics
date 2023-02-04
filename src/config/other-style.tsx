import { Button, Title, Space, Text, ScrollArea, Alert } from "@mantine/core";
import Editor from "react-simple-code-editor";
import {
	SliderConfigComponent,
	SwitchConfigComponent,
} from "./config-components";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-regex";
import "prismjs/components/prism-javascript";
import { useConfig, useLFPSupported } from "../api/react";

export const OtherStyleSettings: React.FC = () => {
	const [customBackgroundRenderFunc, setCustomBackgroundRenderFunc] = useConfig(
		"customBackgroundRenderFunc",
		"",
	);
	const [isLFPSupported, isLFPEnabled] = useLFPSupported();

	return (
		<>
			{isLFPSupported && (
				<Alert
					sx={{ margin: "16px 0" }}
					color={isLFPEnabled ? "green" : "yellow"}
					title="检测到 LibFrontendPlay 插件"
				>
					{isLFPEnabled ? (
						<div>现在可以使用带音频可视化的背景渲染效果了</div>
					) : (
						<div>但是 LibFrontendPlay 并没有启用，无法使用可视化背景效果</div>
					)}
				</Alert>
			)}
			<Title order={2}>其它样式设置</Title>
			<SwitchConfigComponent
				settingKey="autoHideControlBar"
				label="鼠标静止时自动隐藏播放栏和标题栏"
			/>
			<SliderConfigComponent
				step={0.5}
				min={1}
				max={30}
				formatLabel={(v: number) => `${v} 秒`}
				settingKey="autoHideDuration"
				label="鼠标静止隐藏间隔（秒）"
			/>
			<SwitchConfigComponent
				settingKey="usePingFangFont"
				label="播放页面使用苹方字体（需要系统安装）"
			/>
			<Button
				sx={{ margin: "8px 0" }}
				variant="outline"
				onClick={() => {
					betterncm.ncm.openUrl(
						"https://ghproxy.com/https://github.com/paraself/PingFang-Fonts/archive/refs/heads/master.zip",
					);
				}}
			>
				你可以在此下载安装苹方字体
			</Button>
			<Space h="xl" />
			<SwitchConfigComponent
				settingKey="showBackground"
				label="显示背景"
				defaultValue={true}
			/>
			<Space h="xl" />
			<Text fz="md">默认背景设置</Text>
			<Space h="md" />

			<SliderConfigComponent
				settingKey="backgroundLightness"
				label="背景亮度"
				min={0}
				max={2}
				step={0.01}
				defaultValue={1}
				formatLabel={(v: number) => {
					if (v === 1) {
						return "不调整";
					} else if (v < 1) {
						if (v <= 0) {
							return "全黑";
						} else {
							return `调暗 ${Math.round(100 - v * 100)}%`;
						}
					} else {
						if (v >= 2) {
							return "全白";
						} else {
							return `调亮 ${Math.round(v * 100 - 100)}%`;
						}
					}
				}}
			/>

			<Space h="xl" />
			<Text fz="md">自定义背景绘制函数</Text>
			<Space h="md" />
			<Text fz="md">
				如果觉得默认背景不好看，可以尝试自己实现一个绘制方式。
			</Text>
			<Space h="md" />
			<Text fz="md">具体如何编写可以参考本插件的源代码（关于页面有）。</Text>
			<Space h="md" />
			<Space h="md" />
			<Text fz="md">留空则使用默认绘制方式。</Text>
			<ScrollArea
				type="auto"
				offsetScrollbars
				style={{
					background: "#0d1117",
					border: "solid 1px #30363d",
					maxHeight: "512px",
					borderRadius: "4px",
					fontFamily:
						'"Fira Code Regular", "Microsoft Yahei Mono", Consolas, "Courier New", "PingFang SC", monospace',
					fontSize: 14,
				}}
			>
				<Editor
					value={customBackgroundRenderFunc}
					onValueChange={(code) => setCustomBackgroundRenderFunc(code)}
					highlight={(code) => highlight(code, languages.javascript)}
					textareaClassName="mantine-Textarea-input"
					padding={8}
				/>
			</ScrollArea>
		</>
	);
};
