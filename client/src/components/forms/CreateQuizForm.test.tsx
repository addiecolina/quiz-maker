import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateQuizForm } from "./CreateQuizForm";

describe("CreateQuizForm", () => {
  const mockOnSubmit = () => Promise.resolve();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<CreateQuizForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/quiz title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time limit/i)).toBeInTheDocument();
  });

  it("displays validation errors for empty fields", async () => {
    render(<CreateQuizForm onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button", { name: /create quiz/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it("displays validation errors for short title", async () => {
    render(<CreateQuizForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/quiz title/i);
    fireEvent.change(titleInput, { target: { value: "Hi" } });

    const button = screen.getByRole("button", { name: /create quiz/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CreateQuizForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/quiz title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(titleInput, { target: { value: "My Quiz" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test quiz description" },
    });

    const button = screen.getByRole("button", { name: /create quiz/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My Quiz",
          description: "This is a test quiz description",
        })
      );
    });
  });

  it("disables button while loading", () => {
    render(<CreateQuizForm onSubmit={mockOnSubmit} isLoading={true} />);

    const button = screen.getByRole("button", { name: /creating/i });
    expect(button).toBeDisabled();
  });
});
