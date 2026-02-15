import { Component, createSignal, JSXElement } from "solid-js";
import { z } from "zod";

import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import ky from "ky";
import toast, { Toaster } from "solid-toast";
import Input from "../ui/Input";
import { css } from "solid-styled";
import { Portal } from "solid-js/web";

enum FormState {
  unsend,
  sending,
  sended,
  error,
}

type Props = {
  children: JSXElement;
};

const Login: Component<Props> = (props) => {
  const [formState, setFormState] = createSignal<FormState>(FormState.unsend);

  const loginSchema = z.object({
    email: z.string().email("The email address is badly formatted."),
    password: z.string().min(8, "Pasword must have 8 characters or more."),
  });
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
      toast.success("Connected", { id: toastId });
      setFormState(FormState.sended);
    } catch (e) {
      toast.error("Invalid email/password", { id: toastId });
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
        <button class="primary" type="submit">
          Login
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

export default Login;
