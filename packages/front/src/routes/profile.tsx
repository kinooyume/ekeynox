import ky from "ky";
import { Component, createSignal, For, Show } from "solid-js";

// Prisma
type UserRequest = {
  id: string;
  name?: string;
  email: string;
};

export default () => {
  const [profile, setProfile] = createSignal<UserRequest[]>();
  const [error, setError] = createSignal();

  const fetchProfile = () => {
    setError();
    ky.get<UserRequest[]>(`${import.meta.env.VITE_API_URL}/user`)
      .json()
      .then((profileApi) => {
        setProfile(profileApi);
      })
      .catch((e) => setError(e));
  };

  const deleteUser = (id: string) => {
    ky.delete<UserRequest>(`${import.meta.env.VITE_API_URL}/user`, {
      json: { id },
    })
      .json()
      .then(fetchProfile)
      .catch((e) => setError(e));
  };

  return (
    <div>
      <button class="primary" onClick={fetchProfile}>
        GetUser
      </button>
      <Show when={profile()}>
        <ul>
          <For each={profile()!}>
            {(user: UserRequest) => (
              <li>
                <div>
                  <p>{user.email}</p>
                  <p>{user.name}</p>
                  <button class="primary" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <p>{error()?.toString()}</p>
    </div>
  );
};
