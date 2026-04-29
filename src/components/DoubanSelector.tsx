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
  // 为不同的选择器创建独立的refs和状态
  const primaryContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [primaryIndicatorStyle, setPrimaryIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  const secondaryContainerRef = useRef<HTMLDivElement>(null);
  const secondaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [secondaryIndicatorStyle, setSecondaryIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  // ==================== 电影配置 ====================
  const moviePrimaryOptions: SelectorOption[] = [
    { label: '🔥 热门', value: '热门' },
    { label: '🆕 最新', value: '最新' },
    { label: '⭐ 豆瓣高分', value: '豆瓣高分' },
    { label: '💎 冷门佳片', value: '冷门佳片' },
    { label: '📜 经典', value: '经典' },
    { label: '🏆 获奖', value: '获奖' },
  ];

  const movieSecondaryOptions: SelectorOption[] = [
    { label: '🌍 全部', value: '全部' },
    { label: '🇨🇳 华语', value: '华语' },
    { label: '🇺🇸 欧美', value: '欧美' },
    { label: '🇰🇷 韩国', value: '韩国' },
    { label: '🇯🇵 日本', value: '日本' },
    { label: '🎬 动作', value: '动作' },
    { label: '😂 喜剧', value: '喜剧' },
    { label: '💕 爱情', value: '爱情' },
    { label: '🚀 科幻', value: '科幻' },
    { label: '🔍 悬疑', value: '悬疑' },
    { label: '👻 恐怖', value: '恐怖' },
    { label: '🌿 治愈', value: '治愈' },
    { label: '💥 灾难', value: '灾难' },
    { label: '🔫 犯罪', value: '犯罪' },
    { label: '✨ 奇幻', value: '奇幻' },
    { label: '🏔️ 冒险', value: '冒险' },
    { label: '🎨 动画电影', value: '动画电影' },
    { label: '⚔️ 战争', value: '战争' },
    { label: '📖 历史', value: '历史' },
    { label: '📝 传记', value: '传记' },
    { label: '🎵 音乐', value: '音乐' },
    { label: '🏠 家庭', value: '家庭' },
    { label: '🌈 同性', value: '同性' },
    { label: '🤠 西部', value: '西部' },
  ];

  // ==================== 电视剧配置（两级）====================
  // 一级：地区
  const tvPrimaryOptions: SelectorOption[] = [
    { label: '🌍 全部', value: '全部' },
    { label: '🇨🇳 国产', value: '国产剧' },
    { label: '🇺🇸 欧美', value: '美剧' },
    { label: '🇬🇧 英剧', value: '英剧' },
    { label: '🇰🇷 韩国', value: '韩剧' },
    { label: '🇯🇵 日本', value: '日剧' },
    { label: '🇭🇰 港剧', value: '港剧' },
    { label: '🇹🇼 台剧', value: '台剧' },
    { label: '🇹🇭 泰剧', value: '泰剧' },
  ];

  // 二级：类型（题材/类别）
  const tvSecondaryOptions: SelectorOption[] = [
    { label: '📺 全部', value: '全部' },
    { label: '👘 古装', value: '古装' },
    { label: '💑 言情', value: '言情' },
    { label: '🏙️ 都市', value: '都市' },
    { label: '🕵️ 悬疑', value: '悬疑' },
    { label: '🔍 刑侦', value: '刑侦' },
    { label: '🤖 科幻', value: '科幻' },
    { label: '✨ 奇幻', value: '奇幻' },
    { label: '😂 喜剧', value: '喜剧' },
    { label: '🏠 家庭', value: '家庭' },
    { label: '📅 年代', value: '年代' },
    { label: '🎬 短剧', value: '短剧' },
    { label: '🇯🇵 日本动画', value: '日本动画' },
    { label: '🇨🇳 国产动画', value: '国产动画' },
    { label: '🎤 综艺', value: '综艺' },
    { label: '📹 纪录片', value: '纪录片' },
    { label: '🎙️ 脱口秀', value: '脱口秀' },
  ];

  // ==================== 综艺配置（两级）====================
  // 一级：地区
  const showPrimaryOptions: SelectorOption[] = [
    { label: '🇨🇳 国内', value: '国内' },
    { label: '🌏 国外', value: '国外' },
    { label: '🌏 黑料', value: '色情' },
  ];

  // 二级：类型
  const showSecondaryOptions: SelectorOption[] = [
    { label: '🎤 音乐综艺', value: '音乐综艺' },
    { label: '😂 喜剧综艺', value: '喜剧综艺' },
    { label: '👥 真人秀', value: '真人秀' },
    { label: '🏃 竞技综艺', value: '竞技综艺' },
    { label: '🍜 美食综艺', value: '美食综艺' },
    { label: '💕 恋爱综艺', value: '恋爱综艺' },
    { label: '📝 访谈综艺', value: '访谈综艺' },
    { label: '🎓 选秀综艺', value: '选秀综艺' },
    { label: '🏕️ 旅行综艺', value: '旅行综艺' },
    { label: '🏠 生活综艺', value: '生活综艺' },
    { label: '👶 亲子综艺', value: '亲子综艺' },
    { label: '🏢 职场综艺', value: '职场综艺' },
    { label: '🎬 欧美综艺', value: '欧美综艺' },
    { label: '🇯🇵 日韩综艺', value: '日韩综艺' },
  ];

  // 更新指示器位置的通用函数
  const updateIndicatorPosition = (
    activeIndex: number,
    containerRef: React.RefObject<HTMLDivElement>,
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
    setIndicatorStyle: React.Dispatch<
      React.SetStateAction<{ left: number; width: number }>
    >
  ) => {
    if (
      activeIndex >= 0 &&
      buttonRefs.current[activeIndex] &&
      containerRef.current
    ) {
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

  // 组件挂载及类型切换时更新一级指示器位置
  useEffect(() => {
    let primaryOptions: SelectorOption[] = [];
    if (type === 'movie') primaryOptions = moviePrimaryOptions;
    else if (type === 'tv') primaryOptions = tvPrimaryOptions;
    else if (type === 'show') primaryOptions = showPrimaryOptions;

    if (primaryOptions.length > 0) {
      const activeIndex = primaryOptions.findIndex(
        (opt) => opt.value === (primarySelection || primaryOptions[0].value)
      );
      updateIndicatorPosition(
        activeIndex,
        primaryContainerRef,
        primaryButtonRefs,
        setPrimaryIndicatorStyle
      );
    }
  }, [type]);

  // 监听一级选择器变化（更新一级指示器）
  useEffect(() => {
    let primaryOptions: SelectorOption[] = [];
    if (type === 'movie') primaryOptions = moviePrimaryOptions;
    else if (type === 'tv') primaryOptions = tvPrimaryOptions;
    else if (type === 'show') primaryOptions = showPrimaryOptions;

    if (primaryOptions.length > 0 && primarySelection !== undefined) {
      const activeIndex = primaryOptions.findIndex(
        (opt) => opt.value === primarySelection
      );
      updateIndicatorPosition(
        activeIndex,
        primaryContainerRef,
        primaryButtonRefs,
        setPrimaryIndicatorStyle
      );
    }
  }, [primarySelection, type]);

  // 监听二级选择器变化（更新二级指示器）
  useEffect(() => {
    let secondaryOptions: SelectorOption[] = [];
    if (type === 'movie') secondaryOptions = movieSecondaryOptions;
    else if (type === 'tv') secondaryOptions = tvSecondaryOptions;
    else if (type === 'show') secondaryOptions = showSecondaryOptions;

    if (secondaryOptions.length > 0 && secondarySelection !== undefined) {
      const activeIndex = secondaryOptions.findIndex(
        (opt) => opt.value === secondarySelection
      );
      updateIndicatorPosition(
        activeIndex,
        secondaryContainerRef,
        secondaryButtonRefs,
        setSecondaryIndicatorStyle
      );
    }
  }, [secondarySelection, type]);

  // 渲染胶囊式选择器
  const renderCapsuleSelector = (
    options: SelectorOption[],
    activeValue: string | undefined,
    onChange: (value: string) => void,
    isPrimary = false
  ) => {
    const containerRef = isPrimary
      ? primaryContainerRef
      : secondaryContainerRef;
    const buttonRefs = isPrimary ? primaryButtonRefs : secondaryButtonRefs;
    const indicatorStyle = isPrimary
      ? primaryIndicatorStyle
      : secondaryIndicatorStyle;

    return (
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
    );
  };

  // 处理一级变化（可选：切换一级时是否需要重置二级，此处不做自动重置，由父组件决定）
  const handlePrimaryChange = (value: string) => {
    onPrimaryChange(value);
  };

  const handleSecondaryChange = (value: string) => {
    onSecondaryChange(value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 电影类型 */}
      {type === 'movie' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              分类
            </span>
            <div className="overflow-x-auto">
              {renderCapsuleSelector(
                moviePrimaryOptions,
                primarySelection || moviePrimaryOptions[0].value,
                handlePrimaryChange,
                true
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              筛选
            </span>
            <div className="overflow-x-auto">
              {renderCapsuleSelector(
                movieSecondaryOptions,
                secondarySelection || movieSecondaryOptions[0].value,
                handleSecondaryChange,
                false
              )}
            </div>
          </div>
        </div>
      )}

      {/* 电视剧类型 - 两级选择器（与电影相同结构） */}
      {type === 'tv' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              地区
            </span>
            <div className="overflow-x-auto">
              {renderCapsuleSelector(
                tvPrimaryOptions,
                primarySelection || tvPrimaryOptions[0].value,
                handlePrimaryChange,
                true
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              类型
            </span>
            <div className="overflow-x-auto">
              {renderCapsuleSelector(
                tvSecondaryOptions,
                secondarySelection || tvSecondaryOptions[0].value,
                handleSecondaryChange,
                false
              )}
            </div>
          </div>
        </div>
      )}

      {/* 综艺类型 - 两级选择器（与电影相同结构） */}
      {type === 'show' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              地区
            </span>
            <div className="overflow-x-auto">
              {renderCapsuleSelector(
                showPrimaryOptions,
                primarySelection || showPrimaryOptions[0].value,
                handlePrimaryChange,
                true
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              类型
            </span>
            <div className="overflow-x-auto">
              {renderCapsuleSelector(
                showSecondaryOptions,
                secondarySelection || showSecondaryOptions[0].value,
                handleSecondaryChange,
                false
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubanSelector;
