import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddProductForm from "@/components/AddProductForm";

const onProductCreated = vi.fn();

function openForm() {
  fireEvent.click(screen.getByRole("button", { name: "Add product" }));
}

function completeForm() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Beach Chair" } });
  fireEvent.change(screen.getByLabelText("Description"), { target: { value: "A comfortable folding chair." } });
  fireEvent.change(screen.getByLabelText("Price"), { target: { value: "25" } });
  fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Beach Gear" } });
  fireEvent.change(screen.getByLabelText("Image URL"), { target: { value: "https://example.com/chair.jpg" } });
}

function submitForm() {
  fireEvent.click(screen.getAllByRole("button", { name: "Add product", exact: true })[1]);
}

describe("AddProductForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    onProductCreated.mockReset();
  });

  it("shows validation errors for an empty form without calling the API", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<AddProductForm onProductCreated={onProductCreated} />);

    openForm();
    submitForm();

    expect(screen.getByText("Enter a product name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a description.")).toBeInTheDocument();
    expect(screen.getByText("Enter a price.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows success feedback and calls onProductCreated after a successful submission", async () => {
    const product = {
      _id: "1",
      name: "Beach Chair",
      description: "A comfortable folding chair.",
      price: 25,
      category: "Beach Gear",
      imageUrl: "https://example.com/chair.jpg",
      inStock: true,
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(product) }));
    render(<AddProductForm onProductCreated={onProductCreated} />);

    openForm();
    completeForm();
    submitForm();

    expect(await screen.findByText("Product created successfully.")).toBeInTheDocument();
    expect(onProductCreated).toHaveBeenCalledWith(product);
  });

  it("shows an error and keeps entered values when submission fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: vi.fn().mockResolvedValue({ error: "Save failed" }) }),
    );
    render(<AddProductForm onProductCreated={onProductCreated} />);

    openForm();
    completeForm();
    submitForm();

    expect(await screen.findByText("Save failed")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Beach Chair");
    expect(screen.getByLabelText("Price")).toHaveValue(25);
    await waitFor(() => expect(onProductCreated).not.toHaveBeenCalled());
  });
});
