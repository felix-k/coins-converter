import { memo } from "react";
import { Stack } from "@mui/material";

import SegmentedProgress from "./SegmentedProgress";
import ProgressBarButton from "./ProgressBarButton";

type ProgressBarProps = {
  percent: number;
  onClick?: (percent: number) => void;
};

const ProgressBar = memo(({ percent, onClick }: ProgressBarProps) => {
  return (
    <Stack direction="row" gap={2} sx={{ width: 1, my: 2 }}>
      <SegmentedProgress value={percent} segments={4}>
        {(segment) => (
          <ProgressBarButton
            key={segment.index}
            title={segment.label}
            percent={segment.percent}
            endValue={segment.end}
            onClick={onClick}
          />
        )}
      </SegmentedProgress>
    </Stack>
  );
});

export default ProgressBar;
