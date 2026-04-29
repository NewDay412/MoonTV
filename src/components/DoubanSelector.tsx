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

// 独立的胶囊选择器组件
const CapsuleSelector: React.FC<{
  options: SelectorOption[];
  activeValue: string;
  onChange: (value: string) => void;
}> = ({ options, activeValue, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
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

  useEffect(() => {
    const activeIndex = options.findIndex((opt) => opt.value === activeValue);
    updateIndicatorPosition(activeIndex);
  }, [activeValue, options]);

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

// 分组选择器组件（用于电视剧的多行选择）
const GroupedSelector: React.FC<{
  title: string;
  options: SelectorOption[];
  activeValue: string;
  onChange: (value: string) => void;
}> = ({ title, options, activeValue, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
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

  useEffect(() => {
    const activeIndex = options.findIndex((opt) => opt.value === activeValue);
    updateIndicatorPosition(activeIndex);
  }, [activeValue, options]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
        {title}
      </span>
      <div
        ref={containerRef}
        className="relative inline-flex bg-gray-200/60 rounded-full p-0.5 sm:p-1 dark:bg-gray-700/60 backdrop-blur-sm overflow-x-auto"
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
                className={`relative z-10 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
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

const DoubanSelector: React.FC<DoubanSelectorProps> = ({
  type,
  primarySelection,
  secondarySelection,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  // 电影的一级选择器选项
  const moviePrimaryOptions: SelectorOption[] = [
    { label: '🔥 热门', value: '热门' },
    { label: '🆕 最新', value: '最新' },
    { label: '⭐ 豆瓣高分', value: '豆瓣高分' },
    { label: '💎 冷门佳片', value: '冷门佳片' },
    { label: '📜 经典', value: '经典' },
    { label: '🏆 获奖佳作', value: '获奖' },
  ];

  // 电影的二级选择器选项
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

  // 电视剧一级选择器
  const tvPrimaryOptions: SelectorOption[] = [
    { label: '🌍 全部', value: '全部' },
    { label: '🇨🇳 国产剧', value: '国产剧' },
    { label: '🇺🇸 美剧', value: '美剧' },
    { label: '🇬🇧 英剧', value: '英剧' },
    { label: '🇰🇷 韩剧', value: '韩剧' },
    { label: '🇯🇵 日剧', value: '日剧' },
    { label: '🇭🇰 港剧', value: '港剧' },
    { label: '🇹🇼 台剧', value: '台剧' },
    { label: '🇹🇭 泰剧', value: '泰剧' },
  ];

  // 电视剧二级选择器
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
  ];

  // 电视剧三级选择器
  const tvTertiaryOptions: SelectorOption[] = [
    { label: '🇯🇵 日本动画', value: '日本动画' },
    { label: '🇨🇳 国产动画', value: '国产动画' },
    { label: '🎤 综艺', value: '综艺' },
    { label: '🎙️ 脱口秀', value: '脱口秀' },
    { label: '👥 真人秀', value: '真人秀' },
    { label: '📹 纪录片', value: '纪录片' },
  ];

  // 综艺一级选择器
  const showPrimaryOptions: SelectorOption[] = [
    { label: '🇨🇳 国内', value: '国内' },
    { label: '🌏 国外', value: '国外' },
  ];

  // 根据一级选项获取综艺二级选项
  const getShowSecondaryOptions = (primary: string): SelectorOption[] => {
    if (primary === '国内') {
      return [
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
      ];
    } else {
      return [
        { label: '🎬 欧美综艺', value: '欧美综艺' },
        { label: '🇯🇵 日韩综艺', value: '日韩综艺' },
        { label: '👥 真人秀', value: '真人秀' },
        { label: '🎤 音乐综艺', value: '音乐综艺' },
        { label: '😂 喜剧综艺', value: '喜剧综艺' },
        { label: '🏃 竞技综艺', value: '竞技综艺' },
        { label: '🍜 美食综艺', value: '美食综艺' },
        { label: '💕 恋爱综艺', value: '恋爱综艺' },
      ];
    }
  };

  // 解析综艺选中值
  const parseShowSelection = (selection?: string): { primary: string; secondary: string } => {
    if (!selection) return { primary: '国内', secondary: '音乐综艺' };
    const parts = selection.split('|');
    return {
      primary: parts[0] || '国内',
      secondary: parts[1] || '音乐综艺',
    };
  };

  const buildShowSelection = (primary: string, secondary: string): string => {
    return `${primary}|${secondary}`;
  };

  const showSelection = parseShowSelection(secondarySelection);

  // 解析电视剧选中值
  const parseTvSelection = (selection?: string): { primary: string; secondary: string; tertiary: string } => {
    if (!selection) return { primary: '全部', secondary: '全部', tertiary: '' };
    const parts = selection.split('|');
    return {
      primary: parts[0] || '全部',
      secondary: parts[1] || '全部',
      tertiary: parts[2] || '',
    };
  };

  const buildTvSelection = (primary: string, secondary: string, tertiary: string): string => {
    if (tertiary) return `${primary}|${secondary}|${tertiary}`;
    if (secondary && secondary !== '全部') return `${primary}|${secondary}`;
    return primary;
  };

  const tvSelection = parseTvSelection(secondarySelection);

  const handleTvPrimaryChange = (value: string) => {
    const newValue = buildTvSelection(value, tvSelection.secondary, tvSelection.tertiary);
    onSecondaryChange(newValue);
  };

  const handleTvSecondaryChange = (value: string) => {
    const newValue = buildTvSelection(tvSelection.primary, value, tvSelection.tertiary);
    onSecondaryChange(newValue);
  };

  const handleTvTertiaryChange = (value: string) => {
    const newValue = buildTvSelection(tvSelection.primary, tvSelection.secondary, value);
    onSecondaryChange(newValue);
  };

  const handleShowPrimaryChange = (value: string) => {
    const newSecondary = getShowSecondaryOptions(value)[0]?.value || '';
    const newValue = buildShowSelection(value, newSecondary);
    onSecondaryChange(newValue);
  };

  const handleShowSecondaryChange = (value: string) => {
    const newValue = buildShowSelection(showSelection.primary, value);
    onSecondaryChange(newValue);
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
              <CapsuleSelector
                options={moviePrimaryOptions}
                activeValue={primarySelection || moviePrimaryOptions[0].value}
                onChange={onPrimaryChange}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              筛选
            </span>
            <div className="overflow-x-auto">
              <CapsuleSelector
                options={movieSecondaryOptions}
                activeValue={secondarySelection || movieSecondaryOptions[0].value}
                onChange={onSecondaryChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* 电视剧类型 */}
      {type === 'tv' && (
        <div className="space-y-3 sm:space-y-4">
          <GroupedSelector
            title="地区"
            options={tvPrimaryOptions}
            activeValue={tvSelection.primary}
            onChange={handleTvPrimaryChange}
          />
          <GroupedSelector
            title="题材"
            options={tvSecondaryOptions}
            activeValue={tvSelection.secondary}
            onChange={handleTvSecondaryChange}
          />
          <GroupedSelector
            title="类型"
            options={tvTertiaryOptions}
            activeValue={tvSelection.tertiary}
            onChange={handleTvTertiaryChange}
          />
        </div>
      )}

      {/* 综艺类型 */}
      {type === 'show' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              地区
            </span>
            <div className="overflow-x-auto">
              <CapsuleSelector
                options={showPrimaryOptions}
                activeValue={showSelection.primary}
                onChange={handleShowPrimaryChange}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]">
              类型
            </span>
            <div className="overflow-x-auto">
              <CapsuleSelector
                options={getShowSecondaryOptions(showSelection.primary)}
                activeValue={showSelection.secondary}
                onChange={handleShowSecondaryChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubanSelector;
