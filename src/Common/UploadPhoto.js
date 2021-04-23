import Button from "@material-ui/core/Button";
import axios from "axios";
import useToken from "./useToken";
import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function UploadPhoto(props) {
  const { name, label, value, onChange, items, datatest } = props;
  const [loading, setLoading] = useState(false);

  const { token } = useToken();

  const GetImageLink = (e) => {
    setLoading(true);
    console.log(e);
    console.log(e.target.files[0]);
    console.log(token);
    console.log(token === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwNWFhNWU5ZjAwNmQwMDAxNWI5NjQxMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9LCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjE2NTc0MTI0fQ.ulpFbj71hWcov8zDNrnv2f0BdywNPZdEl7C0d8XVE6Q")
    //do the uploading here. then replace some_link below with the image url returned.
    //access the target using e.target.files[0]
    //I'm not sure if we need to async this? and do something while awaiting the return of the image url?

    const fd = new FormData();
    fd.append('file', e.target.files[0], e.target.files[0].name);

    axios
      .post("http://singhealthdb.herokuapp.com/api/image", fd, {params: {secret_token: token}})
      .then((response) => {
        console.log(response.data.url);
        const new_e = Object.create({
          target: { name: name, value: response.data.url },
        });
        console.log(new_e);
        onChange(new_e);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Button variant="contained" component="label" style={{margin:"10px"}}>
      {label}
      <input
        onChange={GetImageLink}
        type="file"
        accept=".jpg,.jpeg,.png"
        name={name}
        data-test={datatest}
        hidden
      />
      <p></p>
      {loading && <CircularProgress size={20} style={{marginLeft:"10px"}} />}
      
    </Button>
  );
}
