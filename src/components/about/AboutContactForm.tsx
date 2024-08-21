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
      color: var(--text-secondary-color);
      font-size: 28px;
      font-weight: 200;
      font-weight: 300;
      margin-top: 0;
    }

    @global {
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 32px;
      }
      .contact-data {
        display: flex;
        gap: 32px;
        padding-bottom: 64px;
      }
    }

    .textarea-wrapper {
      width: 100%;
    }

    .input-wrapper {
    }

    .input-wrapper p {
      margin: 6px 0;
      font-size: 16px;
      font-weight: 400;
      text-transform: capitalize;
    }

    .input-wrapper.invalid input,
    .input-wrapper.invalid textarea {
      border-color: red;
    }

    textarea {
      min-height: 120px;
    }

    .contact-meta {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .input-wrapper input {
      padding: 16px 20px;
    }
    textarea {
      padding: 16px 20px;
    }

    .actions {
      display: flex;
gap: 16px;
      margin-left: auto;
    }
  `;

  return (
    <div class="about-contact">
      <h1>Contact</h1>
      <Show when={formState() === FormState.error}>
        <span class="error">{error()}</span>
      </Show>
      <Form onSubmit={submitHandler} class="contact-form">
        <div class="contact-data">
          <div class="contact-meta">
            <Field name="name" validate={[required("Name is required")]}>
              {(field, props) => (
                <div
                  class="input-wrapper"
                  classList={{ invalid: field.error.length > 0 }}
                >
                  <p>{"name"}</p>
                  <input {...props} type="txt" placeholder="name" required />
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
                <div
                  class="input-wrapper"
                  classList={{ invalid: field.error.length > 0 }}
                >
                  <p>{"Email"}</p>
                  <input {...props} type="email" placeholder="email" required />
                </div>
              )}
            </Field>
          </div>
          <Field name="message" validate={[required("Message is required")]}>
            {(field, props) => (
              <div
                class="input-wrapper textarea-wrapper"
                classList={{ invalid: field.error.length > 0 }}
              >
                <p>{"Message"}</p>
                <textarea {...props} placeholder="message" required />
              </div>
            )}
          </Field>
        </div>
        <div class="actions">
          <button class="secondary" onClick={props.back}>
            cancel
          </button>
          <button class="primary" type="submit">
            Contact Me
          </button>
        </div>
      </Form>
    </div>
  );
};
export default ContactForm;
