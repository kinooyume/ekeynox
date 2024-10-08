import { createForm, zodForm, SubmitHandler } from "@modular-forms/solid";
import ky from "ky";
import { Component, createSignal, JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "solid-styled";
import toast, { Toaster } from "solid-toast";
import { z } from "zod";
import Input from "../ui/Input";
import { useI18n } from "~/contexts/i18nProvider";

enum FormState {
  unsend,
  sending,
  sended,
  error,
}

type Props = {
  children: JSXElement;
};

const loginSchema = z
  .object({
    email: z.string().email("The email address is badly formatted."),
    password: z.string().min(8, "Pasword must have 8 characters or more."),
    confirmPassword: z
      .string()
      .min(8, "Pasword must have 8 characters or more."),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    },
  );

const Register: Component<Props> = (props) => {
  const t = useI18n();
  // function validateConfirmPassword(password: string, confirmPassword: string) {
  //   return password !== "" && password === confirmPassword;
  // }

  const [formState, setFormState] = createSignal<FormState>(FormState.unsend);

  const [loginForm, { Form, Field, FieldArray }] = createForm<
    z.infer<typeof loginSchema>
  >({ validate: zodForm(loginSchema) });

  const handleSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (
    values,
  ) => {
    setFormState(FormState.sending);
    const toastId = toast.loading("Connexion...");
    try {
      const data = await ky
        .post(`${import.meta.env.VITE_API_URL}/login`, { json: values })
        .json();
      console.log(data);
      toast.success("Connected", { id: toastId });
      // redirect
      setFormState(FormState.sended);
    } catch (e) {
      console.log(e);
      // TODO: different error messages for server error/credentials
      toast.error("Invalid email/password", { id: toastId });
      //setError(e);
      setFormState(FormState.error);
    }
  };

  css`
    button.primary {
      margin-top: 20px;
    }
  `;

  return (
    <div class="login-form-wrapper">
      <Form onSubmit={handleSubmit} class="login-form">
        <Field name="email">
          {(field, prps) => (
            <Input
              label="Email"
              type="email"
              inputProps={prps}
              placeholder="Email"
              error={field.error}
              value={field.value}
            />
          )}
        </Field>
        <Field name="password">
          {(field, prps) => (
            <Input
              label="Password"
              type="password"
              inputProps={prps}
              placeholder="********"
              error={field.error}
              value={field.value}
            />
          )}
        </Field>
        <Field name="confirmPassword">
          {(field, prps) => (
            <Input
              label="ConfirmPassword"
              type="password"
              inputProps={prps}
              placeholder="********"
              error={field.error}
              value={field.value}
            />
          )}
        </Field>
        <button class="primary" type="submit">
          {t("sendRegister")}
        </button>
      </Form>
      <Portal mount={document.getElementById("modal-toaster")!}>
        <Toaster
          gutter={8}
          position="top-right"
          toastOptions={{
            duration: 7000,
          }}
        />
      </Portal>
      {props.children}
    </div>
  );
};

export default Register;
