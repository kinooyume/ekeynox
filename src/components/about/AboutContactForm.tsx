import { Component, JSX, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
  SubmitHandler,
  createForm,
  email,
  required,
} from "@modular-forms/solid";
import { css } from "solid-styled";

type ContactFormType = {
  name: string;
  email: string;
  message: string;
  access_key?: string;
};

enum FormState {
  unsend,
  sending,
  sended,
  error,
}

type ContactFormProps = {
  back: () => void;
};

const ContactForm: Component<ContactFormProps> = (props) => {
  const [formState, setFormState] = createSignal<FormState>(FormState.unsend);
  const [error, setError] = createSignal<string | null>(null);
  const [loginForm, { Form, Field, FieldArray }] =
    createForm<ContactFormType>();

  const submitHandler: SubmitHandler<ContactFormType> = async (
    values,
    event,
  ) => {
    const form = {
      ...values,
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
    };

    console.log(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);

    console.log(form);
    setFormState(FormState.sending);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        // const data = await response.json();
        setFormState(FormState.sended);
      } else {
        // Custom message for failed HTTP codes
        if (response.status === 404) throw new Error("404, Not found");
        if (response.status === 500)
          throw new Error("500, internal server error");
        throw new Error(response.status.toString());
      }
    } catch (error) {
      setError("POST: " + error);
      setFormState(FormState.error);
    }
  };

  // TODO: remoe global style
  // ==> Utiliser les modules CSS ( et passer la class module a form )
  css`
    .about-contact {
      border-color: var(--color-surface-alt);
      padding: 26px;
    }
    .about-contact h1 {
      font-size: 1.6rem;
      margin-top: 0;
      font-weight: 200;
    }

    @global {
      .contact-form {
        display: flex;
        flex-direction: column;
        max-width: 400px;
        gap: 16px;
      }
    }
    .input-wrapper {
    }
  `;

  return (
    <div class="about-contact">
      <h1>Contact</h1>
      <p>{formState()}</p>
      <Show when={formState() === FormState.error}>
        <span class="error">{error()}</span>
      </Show>
      <Form onSubmit={submitHandler} class="contact-form">
        <Field name="name" validate={[required("Name is required")]}>
          {(field, props) => (
            <div class="input-wrapper">
              <p>{"name"}</p>
              <input {...props} type="txt" placeholder="name" required />
              <div class="error-wrapper">
                {field.error && <p class="error">{field.error}</p>}
              </div>
            </div>
          )}
        </Field>
        <Field
          name="email"
          validate={[
            required("Please enter your email."),
            email("The email address is badly formatted."),
          ]}
        >
          {(field, props) => (
            <div class="input-wrapper">
              <p>{"email"}</p>
              <input {...props} type="email" placeholder="email" required />
              <div class="error-wrapper">
                {field.error && <p class="error">{field.error}</p>}
              </div>
            </div>
          )}
        </Field>
        <Field name="message" validate={[required("Message is required")]}>
          {(field, props) => (
            <div class="input-wrapper">
              <p>{"Message"}</p>
              <textarea {...props} placeholder="message" required />
              <div class="error-wrapper">
                {field.error && <p class="error">{field.error}</p>}
              </div>
            </div>
          )}
        </Field>
        <button class="secondary" onClick={props.back}>
          cancel
        </button>
        <button class="primary" type="submit">
          Yo
        </button>
      </Form>
      {/* <input type="text" name="name" value={form.name} onChange={(value) => setForm("name", value)} required /> */}
      {/* <input type="email" name="email" required /> */}
      {/* <textarea name="message" required></textarea> */}
    </div>
  );
};
export default ContactForm;
