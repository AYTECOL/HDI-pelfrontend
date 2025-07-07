import React, { useMemo } from 'react';
import classNames from 'classnames';
import Helpers from 'common/helpers/helpers';
import { fieldsNames, TYPES_FILES, TYPES_FILES_LABEL } from './constants';

const UploadFiles = ({
  person: {
    sarlfalt_url: sarlaft,
    habeas_data_url: habeasData,
    cerl_url: cerl,
  },
  showDefaultTextFile,
  isError,
  textFile,
  errorFile,
  onChangeFile,
  typeFile = TYPES_FILES.SARLAFT,
}) => {
  const fileUrl = useMemo(() => {
    switch (typeFile) {
      case TYPES_FILES.SARLAFT:
        return sarlaft;
      case TYPES_FILES.HABEAS_DATA:
        return habeasData;
      case TYPES_FILES.CERL:
        return cerl;
      default:
        return undefined;
    }
  }, [cerl, habeasData, sarlaft, typeFile]);

  const verifyFileUrl = typeof fileUrl === 'string' && fileUrl.trim() !== '';

  const nameLabel = TYPES_FILES_LABEL?.[typeFile]?.name || '';
  const id = TYPES_FILES_LABEL?.[typeFile].id || 'defaultFile';
  return (
    <div className={'row sarlaft'}>
      <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
        <div className={classNames('sarlaft form-group', isError)}>
          <label htmlFor={fieldsNames.address}>
            Es necesario el {nameLabel || ''}{' '}
          </label>
          <span>{TYPES_FILES_LABEL?.[typeFile]?.description || ''}</span>
          <input
            type="file"
            className="form-control"
            name={id || 'defaultFile'}
            onChange={(e) => onChangeFile(e, typeFile)}
            accept={Helpers.fileFormats.join(', ') + ', .docx, .doc'}
          />
          {!textFile ? (
            <p>
              Arrastre archivos para adjuntar, o <b>buscar</b>
            </p>
          ) : (
            <p>{textFile}</p>
          )}
          <span>Formatos permitidos PDF, PNG, GIF, JPG</span>
          {verifyFileUrl && (
            <React.Fragment>
              <br />
              <span>
                <a href={fileUrl}>
                  {fileUrl?.split('/').slice(-1)}
                </a>
              </span>
            </React.Fragment>
          )}
          <br />
          {errorFile && (
            <div className="animated shake">
              <span className="error-file">{errorFile}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
