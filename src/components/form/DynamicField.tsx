import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/types/document";
import { toFormKey, maskCPF, maskCNPJ, maskPhone, maskCurrency } from "@/lib/formData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const masks: Partial<Record<FieldConfig["type"], (v: string) => string>> = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  phone: maskPhone,
  currency: maskCurrency,
};

/** Renderiza um campo a partir da configuração do documento. */
export function DynamicField({ field }: { field: FieldConfig }) {
  const key = toFormKey(field.name);
  const { control, formState } = useFormContext();
  const error = formState.errors[key]?.message as string | undefined;

  return (
    <div className={cn("space-y-2", field.span === 2 ? "sm:col-span-2" : "sm:col-span-1")}>
      {field.type !== "checkbox" && (
        <Label htmlFor={key} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
      )}

      <Controller
        control={control}
        name={key}
        render={({ field: rhf }) => {
          const value = rhf.value ?? (field.type === "checkbox" ? false : "");

          switch (field.type) {
            case "textarea":
            case "address":
              return (
                <Textarea
                  id={key}
                  rows={field.type === "address" ? 2 : 4}
                  placeholder={field.placeholder}
                  value={value as string}
                  onChange={(e) => rhf.onChange(e.target.value)}
                  onBlur={rhf.onBlur}
                  aria-invalid={!!error}
                />
              );
            case "select":
              return (
                <Select value={value as string} onValueChange={rhf.onChange}>
                  <SelectTrigger id={key} aria-invalid={!!error} className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            case "radio":
              return (
                <RadioGroup
                  value={value as string}
                  onValueChange={rhf.onChange}
                  className="flex flex-wrap gap-3"
                >
                  {field.options?.map((o) => (
                    <label
                      key={o.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-accent",
                        value === o.value && "border-primary bg-accent",
                      )}
                    >
                      <RadioGroupItem value={o.value} />
                      {o.label}
                    </label>
                  ))}
                </RadioGroup>
              );
            case "checkbox":
              return (
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm">
                  <Checkbox checked={!!value} onCheckedChange={(c) => rhf.onChange(c === true)} />
                  <span>
                    <span className="font-medium">{field.label}</span>
                    {field.helpText && (
                      <span className="mt-1 block text-xs text-muted-foreground">{field.helpText}</span>
                    )}
                  </span>
                </label>
              );
            default: {
              const mask = masks[field.type];
              return (
                <Input
                  id={key}
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                  inputMode={field.type === "number" ? "numeric" : undefined}
                  placeholder={field.placeholder}
                  value={value as string}
                  onChange={(e) => rhf.onChange(mask ? mask(e.target.value) : e.target.value)}
                  onBlur={rhf.onBlur}
                  aria-invalid={!!error}
                />
              );
            }
          }
        }}
      />

      {field.helpText && field.type !== "checkbox" && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
