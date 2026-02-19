type Segment = {
  index: number;
  start: number;
  end: number;
  percent: number;
  label: string;
};

type SegmentedProgressProps = {
  value: number;
  segments?: number;
  min?: number;
  max?: number;
  children: (segment: Segment) => React.ReactNode;
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const SegmentedProgress = ({
  value,
  segments = 4,
  min = 0,
  max = 100,
  children,
}: SegmentedProgressProps) => {
  const range = max - min;
  const segmentSize = range / segments;

  const items: Segment[] = Array.from({ length: segments }, (_, index) => {
    const start = min + index * segmentSize;
    const end = start + segmentSize;

    const localPercent = ((value - start) / segmentSize) * 100;

    return {
      index,
      start,
      end,
      percent: clamp(localPercent),
      label: `${Math.round(((index + 1) / segments) * 100)}%`,
    };
  });

  return <>{items.map(children)}</>;
};

export default SegmentedProgress;
