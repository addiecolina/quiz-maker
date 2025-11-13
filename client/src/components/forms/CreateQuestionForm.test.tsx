import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { CreateQuestionForm } from "./CreateQuestionForm";

const renderWithProviders = (component: any) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("CreateQuestionForm", () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders MCQ question form", () => {
    renderWithProviders(
      <CreateQuestionForm questionType="mcq" onSubmit={mockOnSubmit} />
    );

    expect(screen.getByLabelText(/question prompt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/options/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correct answer/i)).toBeInTheDocument();
  });

  it("renders short answer question form", () => {
    renderWithProviders(
      <CreateQuestionForm questionType="short" onSubmit={mockOnSubmit} />
    );

    expect(screen.getByLabelText(/question prompt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correct answer/i)).toBeInTheDocument();
  });

  it("renders code question form", () => {
    renderWithProviders(
      <CreateQuestionForm questionType="code" onSubmit={mockOnSubmit} />
    );

    expect(screen.getByLabelText(/question prompt/i)).toBeInTheDocument();
    // Code questions don't have a correct answer field
    expect(screen.queryByLabelText(/correct answer/i)).not.toBeInTheDocument();
  });

  it("validates required prompt field", async () => {
    renderWithProviders(
      <CreateQuestionForm questionType="short" onSubmit={mockOnSubmit} />
    );

    const button = screen.getByRole("button", { name: /create question/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/prompt is required/i)).toBeInTheDocument();
    });
  });

  it("allows adding and removing MCQ options", () => {
    renderWithProviders(
      <CreateQuestionForm questionType="mcq" onSubmit={mockOnSubmit} />
    );

    const addButton = screen.getByText(/add option/i);
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    const removeButtons = screen.getAllByText(/remove/i);
    expect(removeButtons.length).toBeGreaterThan(0);
  });

  it("disables submit button while loading", () => {
    renderWithProviders(
      <CreateQuestionForm
        questionType="short"
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const button = screen.getByRole("button", { name: /creating/i });
    expect(button).toBeDisabled();
  });
});
