import { ImagePlaceholder } from '@/components/ImagePlaceholder';

interface DoubanCardSkeletonProps {
  variant?: 'movie' | 'tv' | 'default';
  showRating?: boolean;
  showYear?: boolean;
}

const DoubanCardSkeleton = ({ 
  variant = 'default',
  showRating = true,
  showYear = true,
}: DoubanCardSkeletonProps) => {
  // 根据 variant 调整骨架屏高度
  const getAspectRatio = () => {
    switch (variant) {
      case 'movie':
        return 'aspect-[2/3]'; // 电影海报比例
      case 'tv':
        return 'aspect-[16/9]'; // 剧集横版比例
      default:
        return 'aspect-[2/3]';
    }
  };

  // 根据 variant 调整信息层位置
  const getInfoPosition = () => {
    switch (variant) {
      case 'movie':
        return 'top-[calc(100%+0.5rem)]';
      case 'tv':
        return 'top-[calc(100%+0.25rem)]';
      default:
        return 'top-[calc(100%+0.5rem)]';
    }
  };

  // 根据 variant 调整标题宽度
  const getTitleWidth = () => {
    switch (variant) {
      case 'movie':
        return 'w-20 sm:w-28';
      case 'tv':
        return 'w-24 sm:w-32';
      default:
        return 'w-20 sm:w-28';
    }
  };

  return (
    <div className='w-full'>
      <div className='group relative w-full rounded-lg bg-transparent shadow-none flex flex-col'>
        {/* 图片占位符 - 骨架屏效果 */}
        <ImagePlaceholder aspectRatio={getAspectRatio()} />

        {/* 信息层骨架 */}
        <div className={`absolute ${getInfoPosition()} left-0 right-0`}>
          <div className='flex flex-col items-center justify-center space-y-1 sm:space-y-1.5'>
            {/* 标题骨架 */}
            <div className={`h-3 sm:h-4 ${getTitleWidth()} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}></div>
            
            {/* 年份骨架 */}
            {showYear && (
              <div className='h-2 sm:h-3 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
            )}
            
            {/* 评分骨架 */}
            {showRating && (
              <div className='flex items-center gap-1'>
                <div className='h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'></div>
                <div className='h-2 sm:h-3 w-8 sm:w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubanCardSkeleton;
