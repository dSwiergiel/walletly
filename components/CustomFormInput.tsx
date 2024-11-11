import React from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldPath, UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface CustomFormInputProps<T extends z.ZodType> {
  control: Control<z.infer<T>>;
  name: FieldPath<z.infer<T>>;
  type: InputType;
  label: string;
  placeholder: string;
}

const CustomFormInput = <T extends z.ZodType>({
  control,
  name,
  label,
  placeholder,
  type,
}: CustomFormInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item w-full">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={type}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomFormInput;
