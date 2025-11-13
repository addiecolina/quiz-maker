import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMcqQuestionSchema,
  createShortQuestionSchema,
  createCodeQuestionSchema,
  type CreateMcqQuestionFormData,
  type CreateShortQuestionFormData,
  type CreateCodeQuestionFormData,
} from "../../lib/validation";
import { type QuestionType } from "../../types";

type CreateQuestionFormData =
  | CreateMcqQuestionFormData
  | CreateShortQuestionFormData
  | CreateCodeQuestionFormData;

interface CreateQuestionFormProps {
  questionType: QuestionType;
  onSubmit: (data: CreateQuestionFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CreateQuestionForm({
  questionType,
  onSubmit,
  isLoading = false,
}: CreateQuestionFormProps) {
  const [error, setError] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const getSchema = () => {
    switch (questionType) {
      case "mcq":
        return createMcqQuestionSchema;
      case "short":
        return createShortQuestionSchema;
      case "code":
        return createCodeQuestionSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateQuestionFormData>({
    resolver: zodResolver(getSchema()),
  });

  const onErrorHandler = (fieldErrors: FieldErrors<CreateQuestionFormData>) => {
    console.log("Form errors:", fieldErrors);
  };

  const onSubmitHandler = async (data: CreateQuestionFormData) => {
    try {
      setError("");
      if (questionType === "mcq") {
        // Validate options before submitting
        const mcqData = data as CreateMcqQuestionFormData;
        if (options.some((opt) => !opt.trim())) {
          setError("All options must be filled in");
          return;
        }
        await onSubmit({ ...mcqData, options });
      } else {
        await onSubmit(data);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create question";
      setError(message);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
      className="space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700"
        >
          Question Prompt
        </label>
        <textarea
          id="prompt"
          {...register("prompt")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your question"
          rows={4}
        />
        {errors.prompt && (
          <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
        )}
      </div>

      {questionType === "mcq" && (
        <>
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Option
              </button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="correctAnswer"
              className="block text-sm font-medium text-gray-700"
            >
              Correct Answer
            </label>
            <select
              id="correctAnswer"
              {...register("correctAnswer")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select correct answer</option>
              {options.map((option, index) => (
                <option key={index} value={index}>
                  Option {index + 1}: {option}
                </option>
              ))}
            </select>
            {questionType === "mcq" &&
              (errors as Partial<Record<string, any>>).correctAnswer && (
                <p className="mt-1 text-sm text-red-600">
                  {
                    (errors as Partial<Record<string, any>>).correctAnswer
                      .message
                  }
                </p>
              )}
          </div>
        </>
      )}

      {questionType === "short" && (
        <div>
          <label
            htmlFor="correctAnswer"
            className="block text-sm font-medium text-gray-700"
          >
            Correct Answer
          </label>
          <input
            id="correctAnswer"
            type="text"
            {...register("correctAnswer")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the correct answer"
          />
          {questionType === "short" &&
            (errors as Partial<Record<string, any>>).correctAnswer && (
              <p className="mt-1 text-sm text-red-600">
                {(errors as Partial<Record<string, any>>).correctAnswer.message}
              </p>
            )}
        </div>
      )}

      {questionType === "code" && (
        <div>
          <label
            htmlFor="correctAnswer"
            className="block text-sm font-medium text-gray-700"
          >
            Correct Answer
          </label>
          <textarea
            id="correctAnswer"
            {...register("correctAnswer")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="Enter the correct code"
            rows={6}
          />
          {questionType === "code" &&
            (errors as Partial<Record<string, any>>).correctAnswer && (
              <p className="mt-1 text-sm text-red-600">
                {(errors as Partial<Record<string, any>>).correctAnswer.message}
              </p>
            )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? "Creating..." : "Create Question"}
      </button>
    </form>
  );
}
