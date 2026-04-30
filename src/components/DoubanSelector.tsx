/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SelectorOption {
  label: string;
  value: string;
}

interface DoubanSelectorProps {
  type: 'movie' | 'tv' | 'show';
  primarySelection?: string;
  secondarySelection?: string;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
}

const DoubanSelector: React.FC<DoubanSelectorProps> = ({
  type,
  primarySelection,
  secondarySelection,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  // 基础配置
  const moviePrimaryOptions = [
    { label: '🔥 热门', value: '热门' }, { label: '🆕 最新', value: '最新' },
    { label: '⭐ 豆瓣高分', value: '豆瓣高分' }, { label: '💎 冷门佳片', value: '冷门佳片' },
    { label: '📜 经典', value: '经典' }, { label: '🏆 获奖', value: '获奖' },
  ];
  const movieSecondaryOptions = [
    { label: '🌍 全部', value: '全部' }, { label: '🇨🇳 华语', value: '华语' }, { label: '🇺🇸 欧美', value: '欧美' },
    { label: '🇰🇷 韩国', value: '韩国' }, { label: '🇯🇵 日本', value: '日本' }, { label: '🎬 动作', value: '动作' },
  ];

  const tvPrimaryOptions = [
    { label: '🌍 全部', value: '全部' }, { label: '🇨🇳 国产', value: '国产剧' }, { label: '🇺🇸 美剧', value: '美剧' },
    { label: '🇬🇧 英剧', value: '英剧' }, { label: '🇰🇷 韩剧', value: '韩剧' }, { label: '🇯🇵 日剧', value: '日剧' },
  ];
  const tvSecondaryOptions = [
    { label: '📺 全部', value: '全部' }, { label: '👘 古装', value: '古装' }, { label: '💑 言情', value: '言情' },
    { label: '🕵️ 悬疑', value: '悬疑' }, { label: '😂 喜剧', value: '喜剧' },
  ];

  const showPrimaryOptions = [{ label: '🇨🇳 国内', value: '国内' }, { label: '🌏 国外', value: '国外' }];
  const showSecondaryOptions = [
    { label: '🎤 音乐', value: '音乐综艺' }, { label: '😂 喜剧', value: '喜剧综艺' }, { label: '🏃 竞技', value: '竞技综艺' },
  ];

  /**
   * 封装的胶囊选择器组件（内部维护自己的指示器状态）
   */
  const CapsuleContainer = ({ 
    options, 
    value, 
    onChange, 
    uniqueKey 
  }: { 
    options: SelectorOption[], 
    value: string, 
    onChange: (v: string) => void,
    uniqueKey: string
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [style, setStyle] = useState({ left: 0, width: 0 });

    // 更新指示器位置
    const updatePosition = () => {
      const index = options.findIndex(opt => opt.value === value);
      const activeEl = itemRefs.current[index];
      if (activeEl && containerRef.current) {
        setStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth
        });
        
        // 自动滚动到中心
        if (scrollRef.current) {
          const scrollPos = activeEl.offsetLeft + activeEl.offsetWidth / 2 - scrollRef.current.clientWidth / 2;
          scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
      }
    };

    useEffect(() => {
      // 稍微延时确保 DOM 布局完成（尤其在切换 type 时）
      const timer = setTimeout(updatePosition, 50);
      return () => clearTimeout(timer);
    }, [value, options, uniqueKey]);

    return (
      <div ref={scrollRef} className="overflow-x-auto scrollbar-none py-1">
        <div ref={containerRef} className="relative inline-flex bg-gray-200/60 dark:bg-gray-700/60 rounded-full p-1 backdrop-blur-sm">
          {/* 滑块指示器 */}
          {style.width > 0 && (
            <div
              className="absolute top-1 bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out"
              style={{ left: `${style.left}px`, width: `${style.width}px` }}
            />
          )}
          
          <div className="flex gap-1 relative">
            {options.map((opt, i) => (
              <button
                key={opt.value}
                ref={el => { itemRefs.current[i] = el; }}
                onClick={() => onChange(opt.value)}
                className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                  value === opt.value
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 根据当前 type 选择显示的数据
  const getRenderData = () => {
    switch (type) {
      case 'tv': return { 
        p: tvPrimaryOptions, 
        s: tvSecondaryOptions, 
        pLabel: '地区', 
        sLabel: '类型' 
      };
      case 'show': return { 
        p: showPrimaryOptions, 
        s: showSecondaryOptions, 
        pLabel: '地区', 
        sLabel: '类型' 
      };
      default: return { 
        p: moviePrimaryOptions, 
        s: movieSecondaryOptions, 
        pLabel: '分类', 
        sLabel: '筛选' 
      };
    }
  };

  const data = getRenderData();

  return (
    <div className="space-y-4 sm:space-y-6" key={type}>
      {/* 一级选择器 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-gray-500 min-w-[48px]">{data.pLabel}</span>
        <CapsuleContainer 
          uniqueKey={`${type}-primary`}
          options={data.p} 
          value={primarySelection || data.p[0].value} 
          onChange={onPrimaryChange} 
        />
      </div>

      {/* 二级选择器 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-gray-500 min-w-[48px]">{data.sLabel}</span>
        <CapsuleContainer 
          uniqueKey={`${type}-secondary`}
          options={data.s} 
          value={secondarySelection || data.s[0].value} 
          onChange={onSecondaryChange} 
        />
      </div>
    </div>
  );
};

export default DoubanSelector;
