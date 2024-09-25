useEffect(() => {
  console.log("Dialog state changed", { openDialog, dialogTitle, dialogContent });
}, [openDialog, dialogTitle, dialogContent]);