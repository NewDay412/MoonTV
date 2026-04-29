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
  // 容器与滚动 Refs
  const primaryScrollRef = useRef<HTMLDivElement>(null);
  const secondaryScrollRef = useRef<HTMLDivElement>(null);
  const primaryContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const secondaryContainerRef = useRef<HTMLDivElement>(null);
  const secondaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [primaryIndicatorStyle, setPrimaryIndicatorStyle] = useState({ left: 0, width: 0 });
  const [secondaryIndicatorStyle, setSecondaryIndicatorStyle] = useState({ left: 0, width: 0 });

  // ==================== 配置数据 ====================
  const moviePrimaryOptions: SelectorOption[] = [
    { label: '🔥 热门', value: '热门' },
    { label: '🆕 最新', value: '最新' },
    { label: '⭐ 豆瓣高分', value: '豆瓣高分' },
    { label: '💎 冷门佳片', value: '冷门佳片' },
    { label: '📜 经典', value: '经典' },
    { label: '🏆 获奖', value: '获奖' },
  ];

  const movieSecondaryOptions: SelectorOption[] = [
    { label: '🌍 全部', value: '全部' }, { label: '🇨🇳 华语', value: '华语' }, { label: '🇺🇸 欧美', value: '欧美' },
    { label: '🇰🇷 韩国', value: '韩国' }, { label: '🇯🇵 日本', value: '日本' }, { label: '🎬 动作', value: '动作' },
    { label: '😂 喜剧', value: '喜剧' }, { label: '💕 爱情', value: '爱情' }, { label: '🚀 科幻', value: '科幻' },
    { label: '🔍 悬疑', value: '悬疑' }, { label: '👻 恐怖', value: '恐怖' }, { label: '🌿 治愈', value: '治愈' },
  ];

  const tvPrimaryOptions: SelectorOption[] = [
    { label: '🌍 全部', value: '全部' }, { label: '🇨🇳 国产', value: '国产剧' }, { label: '🇺🇸 欧美', value: '美剧' },
    { label: '🇬🇧 英剧', value: '英剧' }, { label: '🇰🇷 韩国', value: '韩剧' }, { label: '🇯🇵 日本', value: '日剧' },
    { label: '🇭🇰 港剧', value: '港剧' }, { label: '🇹🇼 台剧', value: '台剧' }, { label: '🇹🇭 泰剧', value: '泰剧' },
  ];

  const tvSecondaryOptions: SelectorOption[] = [
    { label: '📺 全部', value: '全部' }, { label: '👘 古装', value: '古装' }, { label: '💑 言情', value: '言情' },
    { label: '🏙️ 都市', value: '都市' }, { label: '🕵️ 悬疑', value: '悬疑' }, { label: '🔍 刑侦', value: '刑侦' },
    { label: '😂 喜剧', value: '喜剧' }, { label: '🎤 综艺', value: '综艺' }, { label: '📹 纪录片', value: '纪录片' },
  ];

  const showPrimaryOptions: SelectorOption[] = [
    { label: '🇨🇳 国内', value: '国内' }, { label: '🌏 国外', value: '国外' }
  ];

  const showSecondaryOptions: SelectorOption[] = [
    { label: '🎤 音乐', value: '音乐综艺' }, { label: '😂 喜剧', value: '喜剧综艺' }, { label: '👥 真人秀', value: '真人秀' },
    { label: '🏃 竞技', value: '竞技综艺' }, { label: '🍜 美食', value: '美食综艺' }, { label: '💕 恋爱', value: '恋爱综艺' },
  ];

  // ==================== 辅助功能 ====================
  
  // 更新指示器位置
  const updateIndicatorPosition = (
    activeIndex: number,
    containerRef: React.RefObject<HTMLDivElement>,
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
    setIndicatorStyle: React.Dispatch<React.SetStateAction<{ left: number; width: number }>>
  ) => {
    if (activeIndex >= 0 && buttonRefs.current[activeIndex] && containerRef.current) {
      const timeoutId = setTimeout(() => {
        const button = buttonRefs.current[activeIndex];
        const container = containerRef.current;
        if (button && container) {
          const buttonRect = button.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (buttonRect.width > 0) {
            setIndicatorStyle({
              left: buttonRect.left - containerRect.left,
              width: buttonRect.width,
            });
          }
        }
      }, 50); // 增加延时确保 DOM 渲染完成
      return () => clearTimeout(timeoutId);
    }
  };

  // 水平滚动辅助
  const scrollToCenter = (
    scrollRef: React.RefObject<HTMLDivElement>,
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
    activeIndex: number
  ) => {
    if (scrollRef.current && buttonRefs.current[activeIndex]) {
      const container = scrollRef.current;
      const button = buttonRefs.current[activeIndex];
      if (button) {
        const scrollPosition = button.offsetLeft + button.offsetWidth / 2 - container.clientWidth / 2;
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>, scrollRef: React.RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY * 1.5;
      }
    }
  };

  // ==================== 状态监听 ====================

  // 获取当前激活的选项数组
  const getOptions = (isPrimary: boolean) => {
    if (isPrimary) {
      if (type === 'movie') return moviePrimaryOptions;
      if (type === 'tv') return tvPrimaryOptions;
      return showPrimaryOptions;
    } else {
      if (type === 'movie') return movieSecondaryOptions;
      if (type === 'tv') return tvSecondaryOptions;
      return showSecondaryOptions;
    }
  };

  // 监听一级变化
  useEffect(() => {
    const options = getOptions(true);
    const activeValue = primarySelection || options[0].value;
    const activeIndex = options.findIndex(opt => opt.value === activeValue);
    
    const cleanup = updateIndicatorPosition(activeIndex, primaryContainerRef, primaryButtonRefs, setPrimaryIndicatorStyle);
    setTimeout(() => scrollToCenter(primaryScrollRef, primaryButtonRefs, activeIndex), 100);
    return cleanup;
  }, [primarySelection, type]);

  // 监听二级变化
  useEffect(() => {
    const options = getOptions(false);
    const activeValue = secondarySelection || options[0].value;
    const activeIndex = options.findIndex(opt => opt.value === activeValue);
    
    const cleanup = updateIndicatorPosition(activeIndex, secondaryContainerRef, secondaryButtonRefs, setSecondaryIndicatorStyle);
    setTimeout(() => scrollToCenter(secondaryScrollRef, secondaryButtonRefs, activeIndex), 100);
    return cleanup;
  }, [secondarySelection, type]);

  // ==================== 渲染函数 ====================

  const renderCapsuleSelector = (
    options: SelectorOption[],
    activeValue: string | undefined,
    onChange: (value: string) => void,
    isPrimary: boolean,
    scrollRef: React.RefObject<HTMLDivElement>
  ) => {
    const containerRef = isPrimary ? primaryContainerRef : secondaryContainerRef;
    const buttonRefs = isPrimary ? primaryButtonRefs : secondaryButtonRefs;
    const indicatorStyle = isPrimary ? primaryIndicatorStyle : secondaryIndicatorStyle;
    const currentActive = activeValue || options[0].value;

    return (
      <div 
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none"
        onWheel={(e) => handleWheel(e, scrollRef)}
      >
        <div
          ref={containerRef}
          className="relative inline-flex bg-gray-200/60 rounded-full p-0.5 sm:p-1 dark:bg-gray-700/60 backdrop-blur-sm"
        >
          {indicatorStyle.width > 0 && (
            <div
              className="absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out"
              style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
            />
          )}

          <div className="flex gap-0.5 sm:gap-1 relative">
            {options.map((option, index) => {
              const isActive = currentActive === option.value;
              return (
                <button
                  key={option.value}
                  ref={(el) => { buttonRefs.current[index] = el; }}
                  onClick={() => onChange(option.value)}
                  className={`relative z-10 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-gray-900 dark:text-gray-100 cursor-default'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6" key={type}> {/* 关键修复：切换 type 时彻底重装 */}
      {/* 渲染一级选择 */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
            {type === 'movie' ? '分类' : '地区'}
          </span>
          {renderCapsuleSelector(
            getOptions(true),
            primarySelection,
            onPrimaryChange,
            true,
            primaryScrollRef
          )}
        </div>

        {/* 渲染二级选择 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
            {type === 'movie' ? '筛选' : '类型'}
          </span>
          {renderCapsuleSelector(
            getOptions(false),
            secondarySelection,
            onSecondaryChange,
            false,
            secondaryScrollRef
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubanSelector;
