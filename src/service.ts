import { mkdir } from 'fs/promises';
import { Service, Context, h } from 'koishi';
import { resolve } from 'path';
import { Config } from './index';
import { API, PhiB19API, rks, rks27 } from './api';
import { SongInfo, SongRecord, LevelRecord } from './types';
import { renderB19, renderB27 } from './renderer';
import koaSend from 'koa-send';
import type { } from '@koishijs/plugin-server';

export class PhigrosService extends Service {
  static inject = ['database', 'puppeteer', 'server'];
  declare config: Config;
  api: API;
  phiB19API: PhiB19API
  assetPrefix: string;

  constructor(ctx: Context, config: Config) {
    super(ctx, 'phigros', true);
    this.config = config;
    this.api = new API(ctx, config);
    this.phiB19API = new PhiB19API(ctx);

    // 生成资源前缀，dev 模式下使用固定前缀
    const N = 10;
    this.assetPrefix = (Math.random().toString(36) + '00000000000000000').slice(2, N + 2);
    if (this.config.dev) this.assetPrefix = 'dev';

    this.logger.debug(`Asset prefix: ${this.assetPrefix}`);
  }

  async start() {
    await mkdir(resolve(this.ctx.baseDir, 'data/phigros'), { recursive: true });

    // 注册 HTTP 路由用于 dev 模式预览
    if (this.config.dev) {
      this.ctx.server.get(`/phigros/${this.assetPrefix}/b27`, async (koaCtx) => {
        this.logger.info('Dev mode: rendering b27 preview');

        // 准备测试数据
        const mockSongs: SongInfo[] = await this.api.songsInfo();

        // 模拟成绩数据
        const mockRecords: [SongRecord, SongInfo][] = mockSongs.slice(0, 30).map((song, i) => {
          const mockRecord: SongRecord = [];
          
          // 为每个难度添加模拟成绩
          const levels = ['EZ', 'HD', 'IN', 'AT'] as const;
          for (const level of levels) {
            if (song.chart[level]) {
              mockRecord.push([level, {
                score: 1000000 - i * 100,
                accuracy: 100 - i * 0.5,
                fullCombo: i < 5
              }]);
            }
          }

          return [mockRecord, song];
        });

        const rksData = rks27(mockRecords);
        const mockPlayerName = '测试玩家';
        const mockRks = rksData.rks;
        const mockChallengeRank = 'rainbow';
        const mockChallengeLevel = 15;
        
        // 获取 avg accuracy 数据
        const songIds = [...new Set([...rksData.b27.map(r => r.song.id), ...rksData.topThreePhi.map(r => r.song.id)])];
        const PhiB19SongIds = songIds.map(id => id + '.0');
        const songsAvgAcc = await this.phiB19API.allAccAvg(PhiB19SongIds, mockRks - 0.05, mockRks + 0.05);

        rksData.b27.forEach(rksInfo => {
          rksInfo.record.avgAcc = songsAvgAcc[rksInfo.song.id]?.[rksInfo.level]?.accAvg
        })
        rksData.topThreePhi.forEach(rksInfo => {
          rksInfo.record.avgAcc = songsAvgAcc[rksInfo.song.id]?.[rksInfo.level]?.accAvg
        })

        // 渲染 HTML
        const vnode = renderB27(
          mockPlayerName,
          mockRks,
          rksData.topThreePhi,
          rksData.b27,
          mockChallengeRank,
          mockChallengeLevel
        );

        // 使用 h.normalize 将 JSX 转换为 Element 数组，然后调用 toString()
        const elements = h.normalize(vnode);
        let html = '<!DOCTYPE html>' + elements.map(e => e.toString()).join('');
        // 添加 UTF-8 字符集声明
        html = html.replace('<head>', '<head><meta charset="UTF-8"><meta name="referrer" content="no-referrer">');

        koaCtx.set('Content-Type', 'text/html; charset=utf-8');
        koaCtx.body = html;
      });

      this.ctx.server.get(`/phigros/${this.assetPrefix}/b19`, async (koaCtx) => {
        this.logger.info('Dev mode: rendering b19 preview');

        // 准备测试数据
        const mockSongs: SongInfo[] = await this.api.songsInfo();

        // 模拟成绩数据
        const mockRecords: [SongRecord, SongInfo][] = mockSongs.slice(0, 20).map((song, i) => {
          const mockRecord: SongRecord = [];
          
          // 为每个难度添加模拟成绩
          const levels = ['EZ', 'HD', 'IN', 'AT'] as const;
          for (const level of levels) {
            if (song.chart[level]) {
              mockRecord.push([level, {
                score: 1000000 - i * 100,
                accuracy: 100 - i * 0.5,
                fullCombo: i < 5
              }]);
            }
          }

          return [mockRecord, song];
        });

        const rksData = rks(mockRecords);
        const mockPlayerName = '测试玩家';
        const mockRks = rksData.rks;
        const mockChallengeRank = 'rainbow';
        const mockChallengeLevel = 15;

        // 获取 avg accuracy 数据
        const songIds = [...new Set([...rksData.b19.map(r => r.song.id), rksData.bestPhi.song.id])];
        const PhiB19SongIds = songIds.map(id => id + '.0');
        const songsAvgAcc = await this.phiB19API.allAccAvg(PhiB19SongIds, mockRks - 0.05, mockRks + 0.05);

        rksData.b19.forEach(rksInfo => {
          rksInfo.record.avgAcc = songsAvgAcc[rksInfo.song.id]?.[rksInfo.level]?.accAvg
        })
        rksData.bestPhi.record.avgAcc = songsAvgAcc[rksData.bestPhi.song.id]?.[rksData.bestPhi.level]?.accAvg

        // 渲染 HTML
        const vnode = renderB19(
          mockPlayerName,
          mockRks,
          rksData.bestPhi,
          rksData.b19,
          mockChallengeRank,
          mockChallengeLevel
        );

        // 使用 h.normalize 将 JSX 转换为 Element 数组，然后调用 toString()
        const elements = h.normalize(vnode);
        let html = '<!DOCTYPE html>' + elements.map(e => e.toString()).join('');
        // 添加 UTF-8 字符集声明
        html = html.replace('<head>', '<head><meta charset="UTF-8"><meta name="referrer" content="no-referrer">');

        koaCtx.set('Content-Type', 'text/html; charset=utf-8');
        koaCtx.body = html;
      });

      this.logger.info(`Dev 模式已启用，访问以下地址预览:`);
      this.logger.info(`  - b27: http://localhost:${this.ctx.server.port}/phigros/dev/b27`);
      this.logger.info(`  - b19: http://localhost:${this.ctx.server.port}/phigros/dev/b19`);
    }

    // 正常模式下注册随机前缀的资源路由
    if (!this.config.dev) {
      this.ctx.server.get(`/phigros/${this.assetPrefix}/assets/(.*)`, async (koaCtx) => {
        const filename = koaCtx.request.url.slice(`/phigros/${this.assetPrefix}/assets`.length);
        return koaSend(koaCtx, filename, {
          root: resolve(__dirname, '../assets'),
        });
      });
    }
  }
}
