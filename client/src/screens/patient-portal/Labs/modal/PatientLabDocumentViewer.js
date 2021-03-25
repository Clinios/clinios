import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import FileViewer from "react-file-viewer";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs
  .GlobalWorkerOptions
  .workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  appBar: {
    textAlign: "right",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    justifyContent: "space-between",
  },
  PDFViewer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  PaginationWrap: {
    display: "flex",
    justifyContent: "center",
  },
  download: {
    "& a": {
      color: "#ffffff",
      textDecoration: "none",
    },
  },
}));

const checkFileExtension = (fileName) => fileName.substring(fileName.lastIndexOf(".") + 1);

const PatientLabDocumentViewer = ({
  documentName, patientId,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState("");
  const [totalPages, setTotalPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [type, setType] = useState("");

  useEffect(() => {
    const filePath = `${process.env.REACT_APP_API_URL}static/patient/pid${patientId}_${documentName}`;
    setFile(filePath);
    const fileType = checkFileExtension(filePath);
    setType(fileType);
  }, [documentName, patientId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const handleChange = (event, value) => {
    setPageNumber(value);
  };

  const onError = (e) => {
    enqueueSnackbar(e, { variant: "error" });
    console.error("onError", e);
  };


  return (
    <>
      {type && (type === "pdf")
        ? (
          <div className={classes.PDFViewer}>
            <Document
              file={(file)}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {totalPages && (
              <div className={classes.PaginationWrap}>
                <Pagination count={totalPages} shape="rounded" onChange={handleChange} />
              </div>
            )}
          </div>
        )
        : (
          <FileViewer
            fileType={type}
            filePath={file}
            onError={onError}
          />
        )}
    </>
  );
};

PatientLabDocumentViewer.propTypes = {
  patientId: PropTypes.string.isRequired,
  documentName: PropTypes.string.isRequired,
};
export default PatientLabDocumentViewer;
