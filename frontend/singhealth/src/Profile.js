import React, { useState, useEffect } from "react";
import useUser from "./useUser";
import Frame from "./Frame";
import useToken from "./useToken";



// const tenantCard = (props) => {
//     return(
//     <Card className={classes.root}>
//       <CardHeader
//         avatar={
//           <Avatar aria-label="storefront" 
//           className={classes.avatar}
//           src={props.image_logo}>
//           </Avatar>
//         }
//         title={props.name}
//         subheader={props.unit}
//       />
//         <CardContent>
//             <Grid container spacing={2} direction='column'>
//                 <Grid item>
//                     <CardMedia
//                     component="img"
//                     alt="Add a cover image?"
//                     height="100"
//                     image={props.image_location}
//                     title="cover"
//                     />
//                 </Grid>
//                 <Grid item container direction='row'>
//                         <Grid item xs = {1}><LocationOnRoundedIcon /></Grid>
//                         <Grid item xs = {1}></Grid>
//                         <Grid item xs = {10}>
//                         <Typography variant="body2">{props.institution}</Typography>
//                         </Grid>
//                 </Grid>
//                 <Grid item container direction='row'>
//                         <Grid item xs = {1}><PhoneRoundedIcon /></Grid>
//                         <Grid item xs = {1}></Grid>
//                         <Grid item xs = {10}>
//                         <Typography variant="body2">{props.phone}</Typography>
//                         </Grid>
//                 </Grid>
//                 <Grid item container direction='row'>
//                         <Grid item xs = {1}><MailRoundedIcon /></Grid>
//                         <Grid item xs = {1}></Grid>
//                         <Grid item xs = {10}>
//                         <Typography variant="body2">{props.email}</Typography>
//                         </Grid>
//                 </Grid>
//                 <Grid item container direction='row'>
//                         <Grid item xs = {1}><DescriptionRoundedIcon /></Grid>
//                         <Grid item xs = {1}></Grid>
//                         <Grid item xs = {10}>
//                         <Typography variant="body2">Contract expires: {displayDate(props.contract_date)}</Typography>
//                         </Grid>
//                 </Grid>
//             </Grid>
//         </CardContent>
//         </Card>)
// }

export default function Profile() {
  const { user } = useUser();
  const { getRole } = useToken();

  console.log(user.name);

  return (
    <Frame>
      <p>{user.name}</p>
    </Frame>
  );
}
