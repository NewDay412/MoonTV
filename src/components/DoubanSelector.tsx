/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

interface CustomCategory {
  name: string;
  type: 'movie' | 'tv';
  query: string;
}

interface DoubanCustomSelectorProps {
  customCategories: CustomCategory[];
  primarySelection?: string;
  secondarySelection?: string;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
}

// 独立的胶囊选择器组件
const CapsuleSelector: React.FC<{
  options: { label: string; value: string }[];
  activeValue: string;
  onChange: (value: string) => void;
}> = ({ options, activeValue, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicatorPosition = (activeIndex: number) => {
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
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  };

  // 滚动到居中位置
  const scrollToCenter = (activeIndex: number) => {
    if (scrollRef.current && buttonRefs.current[activeIndex]) {
      const container = scrollRef.current;
      const button = buttonRefs.current[activeIndex];
      if (button && container) {
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;
        const containerWidth = container.clientWidth;
        const scrollPosition = buttonLeft + buttonWidth / 2 - containerWidth / 2;
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const activeIndex = options.findIndex((opt) => opt.value === activeValue);
    updateIndicatorPosition(activeIndex);
    setTimeout(() => scrollToCenter(activeIndex), 50);
  }, [activeValue, options]);

  // 水平滚动
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY * 1.5;
    }
  };

  if (options.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
      onWheel={handleWheel}
    >
      <div
        ref={containerRef}
        className="relative inline-flex bg-gray-200/60 rounded-full p-0.5 sm:p-1 dark:bg-gray-700/60 backdrop-blur-sm"
      >
        {indicatorStyle.width > 0 && (
          <div
            className="absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        )}

        <div className="flex gap-0.5 sm:gap-1 relative">
          {options.map((option, index) => {
            const isActive = activeValue === option.value;
            return (
              <button
                key={option.value}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={() => onChange(option.value)}
                className={`relative z-10 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
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

const DoubanCustomSelector: React.FC<DoubanCustomSelectorProps> = ({
  customCategories,
  primarySelection,
  secondarySelection,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  // 根据 customCategories 生成一级选择器选项
  const primaryOptions = useMemo(() => {
    const types = Array.from(new Set(customCategories.map((cat) => cat.type)));
    const sortedTypes = types.sort((a, b) => {
      if (a === 'movie' && b !== 'movie') return -1;
      if (a !== 'movie' && b === 'movie') return 1;
      return 0;
    });
    return sortedTypes.map((type) => ({
      label: type === 'movie' ? '🎬 电影' : '📺 剧集',
      value: type,
    }));
  }, [customCategories]);

  // 根据选中的一级选项生成二级选择器选项
  const secondaryOptions = useMemo(() => {
    if (!primarySelection) return [];
    return customCategories
      .filter((cat) => cat.type === primarySelection)
      .map((cat) => ({
        label: cat.name,
        value: cat.query,
      }));
  }, [customCategories, primarySelection]);

  const currentPrimary = primarySelection || primaryOptions[0]?.value || '';
  const currentSecondary = secondarySelection || secondaryOptions[0]?.value || '';

  // 当一级选项改变时，自动重置二级选择为第一个选项
  const handlePrimaryChange = (value: string) => {
    onPrimaryChange(value);
    // 重要：切换类型后，自动将二级选择设为该类型的第一个选项
    const newSecondaryOptions = customCategories.filter((cat) => cat.type === value);
    if (newSecondaryOptions.length > 0) {
      onSecondaryChange(newSecondaryOptions[0].query);
    }
  };

  // 二级选择变化时的处理
  const handleSecondaryChange = (value: string) => {
    onSecondaryChange(value);
  };

  // 如果没有自定义分类，不渲染
  if (!customCategories || customCategories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 一级选择器 */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
            类型
          </span>
          <CapsuleSelector
            options={primaryOptions}
            activeValue={currentPrimary}
            onChange={handlePrimaryChange}
          />
        </div>
      </div>

      {/* 二级选择器 */}
      {secondaryOptions.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              分类
            </span>
            <CapsuleSelector
              options={secondaryOptions}
              activeValue={currentSecondary}
              onChange={handleSecondaryChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubanCustomSelector;
