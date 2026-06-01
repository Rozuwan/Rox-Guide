import { useState } from "react";
import { supabase } from "../lib/supabase";

function CreateTopicTest() {
  const [title] = useState("BCA 5th Sem");
  const [description] = useState("Semester Resources");
  const session =  supabase.auth.getSession();

console.log(session);

  const createTopic = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.log("ERROR:", userError);
      return;
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const { data, error } = await supabase
      .from("topics")
      .insert({
        title,
        description,
        slug,
        user_id: user.id,
      })
      .select();

    if (error) {
      console.log("ERROR:", error);
    } else {
      console.log("SUCCESS:", data);
    }
  };

  return (
    <div>
      <button onClick={createTopic}>Create Topic</button>
    </div>
  );
}

export default CreateTopicTest;