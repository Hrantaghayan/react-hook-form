import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools"; // ✅ correct
import { useEffect } from "react";

let rendercount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};
// fundementals
export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "Hrant",
      email: "aghayanh66@gmail.com",
      channel: "asdchannel",
      social: {
        // twitter: "twitter",
        facebook: "facebook",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "84848" }],
      age: 0,
      dob: new Date(),
    },
    // mode:"all", //chnage the default validation of form
    //     defaultValues: async () => {
    //   const response = await fetch(
    //     "https://jsonplaceholder.typicode.com/users/1"
    //   );
    //   const data = await response.json();
    //   return {
    //     username: data?.username || "",
    //     email: data?.email || "",
    //     channel: data?.id?.toString() || "",
    //   };
    // },
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;
  const {
    errors,
    // touchedFields,
    // dirtyFields,
    // isDirty,
    // isValid,
    // isSubmitting,
    // isSubmitted,
    isSubmitSuccessful,
    // submitCount,
  } = formState;

  // const watchUsername = watch(["username", "email"]);
  const watchForm = watch();

  useEffect(() => {
    //useage in useffect for side eefects
    const subscription = watch((value) => console.log("useffect", value));
    return subscription.unsubscribe;
  }, [watch]);

  const onSubmit = (data: FormValues) => {
    console.log("formSubmited", data);
  };

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const handleGetvalues = () => {
    console.log("getvlaues", getValues());
    console.log("social", getValues("social"));
    console.log("twiiter", getValues("social.twitter"));
    console.log("multiple", getValues(["username", "channel"]));
  };

  const handleSetValue = () => {
    // this is right choise because there can be cases when we should wathc the values of touched and other fields
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // touched =  user has interacted fiedls or not  will trigger even wehn doesnot do any changes
  // dirty = user has modified field or not comparison is made with default value
  // disabled validation also disappeared
  // reset brings back to default values

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("errors", errors);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <h1>YouTube Form({rendercount})</h1>
      <h2>{JSON.stringify(watchForm)} </h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          {" "}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "Username is required.",
            })}
          />
          <p className="error">{errors?.username?.message}</p>
        </div>

        <div className="form-control">
          {" "}
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "invalid Email format",
              },
              // validate:(fieldValue)=>{
              //  return fieldValue !== "admin@example.com" || "Enter different email address"
              // }with function
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter different email address"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue?.endsWith("bamdomain.com") ||
                    "this domain is not suuported"
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  console.log("data", data);
                  return data.length === 0 || "Email alreadya exits";
                },
              },
            })}
          />
          <p className="error">{errors?.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: "channel is required",
            })}
          />
          <p className="error">{errors?.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              required: "twiiter is required",
              // disabled:true,
              disabled: watch("channel") === "",
            })}
          />
          <p className="error">{errors?.social?.twitter?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            {...register("social.facebook", {
              required: "facebook is required",
            })}
          />
          <p className="error">{errors?.social?.facebook?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone number</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0", {
              required: "Primary phone is required",
            })}
          />
          <p className="error">{errors?.phoneNumbers?.[0]?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1", {
              required: "secondary phone is required",
            })}
          />
          <p className="error">{errors?.phoneNumbers?.[1]?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true, // made value as number
              required: {
                value: true,
                message: "age is required",
              },
            })}
          />
          <p className="error">{errors?.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Age</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true, // made value as date
              required: {
                value: true,
                message: "dob is required",
              },
            })}
          />
          <p className="error">{errors?.dob?.message}</p>
        </div>

        <div>
          <label>list of phone numbers</label>
          <div>
            {fields?.map((field, index) => {
              return (
                <div className="form-control" key={field?.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number`, {
                      required: `phone number ${index} is required`,
                    })}
                  />
                  <p className="error">
                    {errors?.phNumbers?.[index]?.number?.message}
                  </p>
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add Phone Number
            </button>
          </div>
        </div>
        <button
        // disabled={isSubmitting || !isValid || !isDirty}
        >
          Submit
        </button>
        <button onClick={handleGetvalues} type="button">
          Get value
        </button>
        <button onClick={handleSetValue} type="button">
          Set value
        </button>
        <button
          onClick={() => {
            reset();
          }}
          type="button">
          Reset
        </button>
        <button
          onClick={() => {
            trigger("social.twitter");
            // all validation trigger without passing parametr to trigger
          }}
          type="button">
          triggre
        </button>
        <DevTool control={control} />
      </form>
    </div>
  );
};
