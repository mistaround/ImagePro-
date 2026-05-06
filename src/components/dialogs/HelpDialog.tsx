import React from 'react';
import { useUIStore } from '../../stores/useUIStore.js';

const sections = [
  {
    title: '导航 / 翻页',
    rows: [
      ['← →', '翻到上一张 / 下一张（按当前匹配规则同步）'],
      ['Home / End', '首张 / 末张'],
      ['F / Esc', '全屏单格 / 退出全屏'],
    ],
  },
  {
    title: '缩放 与 平移',
    rows: [
      ['滚轮', '缩放当前鼠标所在格'],
      ['Ctrl + 滚轮', '同步缩放所有格'],
      ['拖动', '平移当前格'],
      ['Ctrl + 拖动', '同步平移所有格'],
      ['0', '重置缩放与平移'],
    ],
  },
  {
    title: '对比（Peek）',
    rows: [
      ['按住格子右下 peek 按钮', '把这格的图叠到鼠标所在格上对比'],
      ['P 键', '在当前格 peek 第 1 格（baseline）'],
      ['Shift + P', '在所有格 peek 第 1 格'],
    ],
  },
  {
    title: '右侧图片列表点击',
    rows: [
      ['点击', '改变对应文件夹格的图片'],
      ['Ctrl + 点', '按索引同步切换所有格'],
      ['Alt + 点', '按文件名同步切换所有格（匹配不到的不变）'],
    ],
  },
  {
    title: 'Tag',
    rows: [
      ['1 / 2 / 3 / 4', '给当前选中图打 tag'],
      ['Ctrl + 1234', '给所有格的图打同一 tag'],
      ['0', '清除当前 tag'],
    ],
  },
];

export default function HelpDialog() {
  const setShow = useUIStore((s) => s.setShowHelpDialog);

  return (
    <div
      onClick={() => setShow(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxHeight: '80vh',
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          borderRadius: 8,
          boxShadow: '4px 6px 0 rgba(31,29,26,0.10)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--rule)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>使用说明 · 快捷键</span>
          <button
            onClick={() => setShow(false)}
            style={{
              width: 24, height: 24,
              border: '1px solid var(--rule)',
              borderRadius: 4,
              background: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >✕</button>
        </div>
        <div style={{
          padding: 16,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          {sections.map((s, i) => (
            <div key={i}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ink-2)',
                marginBottom: 6,
                paddingBottom: 4,
                borderBottom: '1px dashed var(--ink-3)',
              }}>{s.title}</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '4px 16px',
              }}>
                {s.rows.map((r, j) => (
                  <React.Fragment key={j}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      background: 'var(--paper-2)',
                      border: '1px solid var(--ink-3)',
                      borderRadius: 3,
                      padding: '1px 6px',
                      color: 'var(--ink)',
                      alignSelf: 'start',
                      whiteSpace: 'nowrap',
                    }}>{r[0]}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>{r[1]}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--rule)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
        }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', flex: 1 }}>
            提示：可以在主界面按 ? 或 F1 随时打开此面板
          </span>
          <button
            onClick={() => setShow(false)}
            style={{
              padding: '4px 16px',
              border: '1px solid var(--rule)',
              borderRadius: 6,
              background: 'var(--ink)',
              color: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >明白了</button>
        </div>
      </div>
    </div>
  );
}
