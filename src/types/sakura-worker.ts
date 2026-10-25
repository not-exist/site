/**
 * 樱花特效类型定义与 Worker 通信协议
 * （自 firefly-6.16.8-archive 移植；配置类型原在 src/types/effectsConfig.ts，
 *  本站无设置面板切换需求，故随组件硬编码配置、类型收敛到本文件）
 */

// 樱花特效配置
export type SakuraConfig = {
    // 是否启用樱花特效
    enable: boolean;
    // 樱花数量
    sakuraNum: number;
    // 樱花越界限制次数，-1为无限循环
    limitTimes: number;
    // 樱花尺寸倍数范围（基准 40px）
    size: {
        min: number;
        max: number;
    };
    // 樱花不透明度范围
    opacity: {
        min: number;
        max: number;
    };
    // 樱花移动速度
    speed: {
        // 水平漂移速度范围
        horizontal: {
            min: number;
            max: number;
        };
        // 垂直下落速度范围
        vertical: {
            min: number;
            max: number;
        };
        // 旋转速度
        rotation: number;
        // 消失速度，不应大于最小不透明度
        fadeSpeed: number;
    };
    // 画布层级
    zIndex: number;
};

/**
 * 樱花特效 Worker 通信消息类型
 *
 * 主线程 → Worker 的消息(通过 worker.postMessage 发送)
 */
export type SakuraWorkerInboundMessage =
    | {
          type: "init";
          config: SakuraConfig;
          /** 通过 transfer 转移给 Worker 的 OffscreenCanvas */
          canvas: OffscreenCanvas;
          width: number;
          height: number;
      }
    | { type: "start" }
    | { type: "stop" }
    | { type: "resize"; width: number; height: number }
    | { type: "visibilitychange"; hidden: boolean };

/**
 * Worker → 主线程 的消息(通过 self.postMessage 发送)
 */
export type SakuraWorkerOutboundMessage =
    | {
          type: "ready";
      }
    | {
          type: "error";
          message: string;
          stack?: string;
      }
    | {
          type: "messageError";
          message: string;
      };

/**
 * 主线程侧的 sakuraManager 接口契约
 *
 * Worker 模式与主线程回退模式都需实现该接口，保证两种实现可互换。
 */
export interface SakuraManagerLike {
    config: SakuraConfig;
    isRunning: boolean;
    init: () => Promise<void>;
    stop: () => void;
    getIsRunning: () => boolean;
}
