import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';

export default function UploadPhoto(props) {

    const { name, label, value, onChange, items } = props;

    const GetImageLink = (e) => {
        console.log(e)
        //do the uploading here. then replace some_link below with the image url returned.
        //access the target using e.target.files[0]
        //I'm not sure if we need to async this? and do something while awaiting the return of the image url?
        const new_e = Object.create(
            {target: { name: {name}, value: e.target.files[0].name}}
        )
        onChange(new_e)
    }

    return (
        <Button variant="contained" component="label" >
            {label}
            <input onChange={GetImageLink}  type="file" name={name} hidden />   
        </Button>
    );
}