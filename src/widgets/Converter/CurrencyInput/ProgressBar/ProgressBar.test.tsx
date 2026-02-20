import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  describe("rendering", () => {
    it("renders 4 segment buttons", () => {
      render(<ProgressBar percent={0} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(4);
    });

    it("displays correct labels", () => {
      render(<ProgressBar percent={0} />);
      expect(screen.getAllByText("25%")).toHaveLength(2);
      expect(screen.getAllByText("50%")).toHaveLength(2);
      expect(screen.getAllByText("75%")).toHaveLength(2);
      expect(screen.getAllByText("100%")).toHaveLength(2);
    });
  });

  describe("click handling", () => {
    it("calls onClick with 25 for first button", () => {
      const onClick = vi.fn();
      render(<ProgressBar percent={0} onClick={onClick} />);

      fireEvent.click(screen.getAllByRole("button")[0]);

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick).toHaveBeenCalledWith(25);
    });

    it("calls onClick with 50 for second button", () => {
      const onClick = vi.fn();
      render(<ProgressBar percent={0} onClick={onClick} />);

      fireEvent.click(screen.getAllByRole("button")[1]);

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick).toHaveBeenCalledWith(50);
    });

    it("calls onClick with 75 for third button", () => {
      const onClick = vi.fn();
      render(<ProgressBar percent={0} onClick={onClick} />);

      fireEvent.click(screen.getAllByRole("button")[2]);

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick).toHaveBeenCalledWith(75);
    });

    it("calls onClick with 100 for fourth button", () => {
      const onClick = vi.fn();
      render(<ProgressBar percent={0} onClick={onClick} />);

      fireEvent.click(screen.getAllByRole("button")[3]);

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick).toHaveBeenCalledWith(100);
    });

    it("does not throw when onClick is not provided", () => {
      render(<ProgressBar percent={0} />);
      expect(() => {
        fireEvent.click(screen.getAllByRole("button")[0]);
      }).not.toThrow();
    });
  });

  describe("percent propagation", () => {
    it("renders without error at 0%", () => {
      const { container } = render(<ProgressBar percent={0} />);
      expect(container.querySelector(".MuiStack-root")).toBeInTheDocument();
    });

    it("renders without error at 100%", () => {
      const { container } = render(<ProgressBar percent={100} />);
      expect(container.querySelector(".MuiStack-root")).toBeInTheDocument();
    });

    it("renders without error at 50%", () => {
      const { container } = render(<ProgressBar percent={50} />);
      expect(container.querySelector(".MuiStack-root")).toBeInTheDocument();
    });
  });
});
