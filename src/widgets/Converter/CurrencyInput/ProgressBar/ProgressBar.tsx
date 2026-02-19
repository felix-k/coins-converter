import { Stack } from "@mui/material";

import SegmentedProgress from "./SegmentedProgress";
import ProgressBarButton from "./ProgressBarButton";

type ProgressBarProps = {
  percent: number;
  onClick?: (percent: number) => void;
};

const ProgressBar = ({ percent, onClick }: ProgressBarProps) => {
  return (
    <Stack direction="row" gap={2} sx={{ width: 1, my: 2 }}>
      <SegmentedProgress value={percent} segments={4}>
        {(segment) => (
          <ProgressBarButton
            key={segment.index}
            title={segment.label}
            percent={segment.percent}
            onClick={() => onClick?.(segment.end)}
          />
        )}
      </SegmentedProgress>
    </Stack>
  );
};

export default ProgressBar;
