import axios from "axios";
import { isEquivalent } from "lib/utils";
import { useSession } from "components/hooks/useSession";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import formStyles from "../Forms.module.scss";

const Settings: React.FC = () => {
  const [session] = useSession();

  if (typeof session === "boolean")
    throw new Error("There's a problem with the session");

  const { user } = session;

  const [gazPrice, setGazPrice] = useState(String(user.gazPrice));
  const [electricityPrice, setElectricityPrice] = useState(
    String(user.electricityPrice)
  );
  const [deliveryPrice, setDeliveryPrice] = useState(
    String(user.deliveryPrice)
  );
  const [savingMsg, setSavingMsg] = useState("");

  const queryClient = useQueryClient();
  const abortController = new AbortController();

  const editSettingsMutation = useMutation(
    "session",
    async () => {
      const response = await axios.put(
        "/api/user",
        {
          gazPrice,
          electricityPrice,
          deliveryPrice,
        },
        {
          signal: abortController.signal,
        }
      );

      return response;
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries("session");
        setSavingMsg("Modifications enregistrées");
      },
      onError: async (err) => {
        console.error(err);
        setSavingMsg("Oups ! Il y a eu un problème...");
      },
    }
  );

  useEffect(() => {
    const prev = {
      gazPrice: String(user.gazPrice),
      electricityPrice: String(user.electricityPrice),
      deliveryPrice: String(user.deliveryPrice),
    };

    if (!isEquivalent(prev, { gazPrice, electricityPrice, deliveryPrice })) {
      const timeout = setTimeout(() => {
        editSettingsMutation.mutate();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [
    gazPrice,
    electricityPrice,
    deliveryPrice,
    editSettingsMutation,
    user.gazPrice,
    user.electricityPrice,
    user.deliveryPrice,
  ]);

  const handleUpdate = (
    value: string,
    setStateAction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!/(\.\w{3,})$/.test(value)) setStateAction((prev) => prev === "0" ? value[1] || "0" : value || "0");
    setSavingMsg("Modifications en cours...");
  };

  return (
    <>
      <h3>Paramètres</h3>
      <form className={formStyles.form}>
        {savingMsg}
        <div className={formStyles.inputWrapper}>
          <label htmlFor="gazPrice">Prix du gaz</label>
          <input
            type="number"
            id="gazPrice"
            min="0"
            step="0.01"
            value={gazPrice}
            onChange={(e) => handleUpdate(e.target.value, setGazPrice)}
            className={formStyles.input}
          />
          <label htmlFor="electricityPrice">Prix de l&apos;électricité</label>
          <input
            type="number"
            id="electricityPrice"
            min="0"
            step="0.01"
            value={electricityPrice}
            onChange={(e) => handleUpdate(e.target.value, setElectricityPrice)}
            className={formStyles.input}
          />
          <label htmlFor="deliveryPrice">Prix de livraison</label>
          <input
            type="number"
            id="deliveryPrice"
            min="0"
            step="0.01"
            value={deliveryPrice}
            onChange={(e) => handleUpdate(e.target.value, setDeliveryPrice)}
            className={formStyles.input}
          />
        </div>
      </form>
    </>
  );
};

export default Settings;
