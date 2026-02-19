import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import CurrencyInput from "./CurrencyInput";

const defaultProps = {
  min: 100,
  max: 1000,
  step: 0.01,
  value: 500,
  ticker: "USDT" as const,
  onChange: vi.fn(),
};

function getInput(): HTMLInputElement {
  return screen.getByRole("textbox");
}

describe("CurrencyInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("displays the ticker", () => {
      render(<CurrencyInput {...defaultProps} />);
      expect(screen.getByText("USDT")).toBeInTheDocument();
    });

    it("displays formatted value in input", () => {
      render(<CurrencyInput {...defaultProps} value={500} />);
      expect(getInput()).toHaveValue("500.00");
    });
  });

  describe("text input", () => {
    it("accepts digits and dots", () => {
      render(<CurrencyInput {...defaultProps} />);
      fireEvent.change(getInput(), { target: { value: "123.45" } });
      expect(getInput()).toHaveValue("123.45");
    });

    it("rejects letters and special characters", () => {
      render(<CurrencyInput {...defaultProps} />);
      fireEvent.change(getInput(), { target: { value: "12abc" } });
      expect(getInput()).toHaveValue("500.00");
    });
  });

  describe("debounced normalization", () => {
    it("calls onChange after delay", () => {
      const onChange = vi.fn();
      render(<CurrencyInput {...defaultProps} onChange={onChange} />);

      fireEvent.change(getInput(), { target: { value: "750" } });
      expect(onChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.calls[0][0].toNumber()).toBe(750);
    });

    it("clamps value below min to min", () => {
      const onChange = vi.fn();
      render(<CurrencyInput {...defaultProps} onChange={onChange} />);

      fireEvent.change(getInput(), { target: { value: "50" } });
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onChange.mock.calls[0][0].toNumber()).toBe(100);
    });

    it("clamps value above max to max", () => {
      const onChange = vi.fn();
      render(<CurrencyInput {...defaultProps} onChange={onChange} />);

      fireEvent.change(getInput(), { target: { value: "2000" } });
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onChange.mock.calls[0][0].toNumber()).toBe(1000);
    });

    it("aligns value to step grid", () => {
      const onChange = vi.fn();
      render(
        <CurrencyInput
          min={0}
          max={100}
          step={5}
          value={50}
          ticker="USDT"
          onChange={onChange}
        />,
      );

      fireEvent.change(getInput(), { target: { value: "47" } });
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onChange.mock.calls[0][0].toNumber()).toBe(45);
    });
  });

  describe("progress bar", () => {
    it("sets value to 25% of range on first button click", () => {
      const onChange = vi.fn();
      render(
        <CurrencyInput
          min={0}
          max={1000}
          step={1}
          value={0}
          ticker="USDT"
          onChange={onChange}
        />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]);
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.calls[0][0].toNumber()).toBe(250);
    });

    it("sets value to 100% of range on last button click", () => {
      const onChange = vi.fn();
      render(
        <CurrencyInput
          min={0}
          max={1000}
          step={1}
          value={0}
          ticker="USDT"
          onChange={onChange}
        />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[3]);
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.calls[0][0].toNumber()).toBe(1000);
    });
  });

  describe("external value update", () => {
    it("updates input when value prop changes", () => {
      const { rerender } = render(
        <CurrencyInput {...defaultProps} value={500} />,
      );
      expect(getInput()).toHaveValue("500.00");

      rerender(<CurrencyInput {...defaultProps} value={750} />);
      expect(getInput()).toHaveValue("750.00");
    });
  });
});
