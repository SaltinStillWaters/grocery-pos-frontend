import axios, { AxiosError } from "axios";
import type { AuthUser } from "./types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Dto } from "./dto";
export const API_URL = "http://localhost:3000";

export async function getUser(
  navigate: (path: string) => void,
  isLoginPage: boolean = false
): Promise<AuthUser | undefined> {
  try {
    const res = await axios.get(`${API_URL}/users/profile`, {
      withCredentials: true,
    });

    if (isLoginPage) navigate("/dashboard");

    return res.data.data;
  } catch (err) {
    if (!isLoginPage) navigate("/login");
  }
}

export function useCurrentUser(isLoginPage: boolean = false) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser(navigate, isLoginPage);
      setUser(u ?? null);
    })();
  }, [navigate]);

  return user;
}

export function useChangeTracker<T extends Record<string, any>>() {
  const [changes, setChanges] = useState<Record<string, Partial<T>>>({});

  function handleChange(_id: string, original: T, keyVal: Partial<T>) {
    setChanges((prev) => {
      const singleChanges = { ...prev[_id], ...keyVal };
      Object.keys(keyVal).forEach((key) => {
        const k = key as keyof T;
        const val = singleChanges[k];

        if (
          val === null ||
          val === "" ||
          //Note: this is a bug for passwords
          (typeof val === "string" &&
            typeof original[k] === "string" &&
            val.toUpperCase() === original[k].toUpperCase()) ||
          val === original[k]
        ) {
          delete singleChanges[k];
        }
      });

      const newChanges = { ...prev, [_id]: singleChanges };
      if (Object.keys(newChanges[_id]).length === 0) {
        delete newChanges[_id];
      }

      return newChanges;
    });
  }

  return { changes, setChanges, handleChange };
}

export function useErrors<T>() {
  const [errors, setErrors] = useState<
    Record<string, Partial<Record<keyof T, string>>>
  >({});

  function handleError(err: unknown, payload: Dto, idKey: string) {
    setErrors({});
    if (!err || typeof err !== "object" || !("response" in err)) throw err;

    const message = ((err as AxiosError).response?.data as any)?.message;
    const messages = Array.isArray(message) ? message : [message];

    let newErrors: Record<string, Partial<Record<keyof T, string>>> = {};

    if (typeof messages[0] === "string") {
      if (messages[0].match(/\S+\.\S+/)) {
        messages.forEach((m: string) => {
          let splits = m.split(".");

          const last = splits[splits.length - 1];
          const [propName] = last.split(" ");
          const errMsg = last.split(propName)[1].trim();
          const property = propName;

          splits[splits.length - 1] = property;

          let iter: any = payload;

          for (let x = 0; x < splits.length - 1; ++x) {
            const val = splits[x];

            const isNum = (str: string) =>
              str.trim() !== "" && Number.isFinite(Number(str));

            const key: string | number = isNum(val) ? Number(val) : val;
            iter = iter[key];

            if (iter?.[idKey]) {
              const _id = iter[idKey];
              newErrors[_id] = {
                ...(newErrors[_id] || {}),
                [property]: errMsg,
              };
              break;
            }
          }
        });
      }
    } else if (messages[0]?.["msg"]) {
      messages.map(
        ({
          msg,
          _id,
          property,
        }: {
          msg: string;
          _id: string;
          property: string;
        }) => {
          newErrors[_id] = {
            ...(newErrors[_id] || {}),
            [property]: msg,
          };
        }
      );
    } else {
      throw err;
    }

    setErrors(newErrors);
  }

  return { errors, setErrors, handleError };
}
