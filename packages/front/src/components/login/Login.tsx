import { Component, createSignal } from "solid-js";
import { z } from "zod";

import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import ky from "ky";
import toast, { Toaster } from "solid-toast";
import Input from "../ui/Input";
import { css } from "solid-styled";
import { Portal } from "solid-js/web";

const loginSchema = z.object({
  email: z.string().email("The email address is badly formatted."),
  password: z.string().min(8, "Pasword must have 8 characters or more."),
});

enum FormState {
  unsend,
  sending,
  sended,
  error,
}

const Login: Component<{}> = () => {
  const [formState, setFormState] = createSignal<FormState>(FormState.unsend);
  const [error, setError] = createSignal<string | null>(null);

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
      <Portal mount={document.getElementById("modal-toaster")!}>
        <Toaster
          gutter={8}
          position="top-center"
          toastOptions={{
            duration: 7000,
          }}
        />
      </Portal>
      <Form onSubmit={handleSubmit} class="login-form">
        <Field name="email">
          {(field, props) => (
            <Input
              label="Email"
              type="email"
              inputProps={props}
              placeholder="Email"
              error={field.error}
              value={field.value}
            />
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <Input
              label="Password"
              type="password"
              inputProps={props}
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
    </div>
  );
};

export default Login;
