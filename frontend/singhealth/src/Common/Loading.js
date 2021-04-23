import CircularProgress from "@material-ui/core/CircularProgress";

export default function Loading() {
  return(
    <div style={{ position: "absolute", top: "50%", left: "50%" }}>
      <CircularProgress color="secondary" />
    </div>

  )
}