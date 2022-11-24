import React from 'react';
import classNames from 'classnames';
import Helpers from 'common/helpers/helpers';
import { fieldsNames } from './constants';

const UploadFiles = ({
  person: { sarlfalt_url, habeas_data_url },
  showDefaultTextFile,
  isError,
  textFile,
  errorFile,
  typeFile,
  changeTextFile,
}) => {
  let fileUrl;
  if (sarlfalt_url) {
    fileUrl = sarlfalt_url;
  } else {
    fileUrl = habeas_data_url || undefined;
  }
  return (
    <div className={'row sarlaft'}>
      <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
        <div className={classNames('sarlaft form-group', isError)}>
          <label htmlFor={fieldsNames.address}>
            Es necesario el {!typeFile ? 'sarlaft' : 'Habeas Data'}{' '}
          </label>
          <span>
            Adjunta el {!typeFile ? 'sarlaft' : 'Habeas Data'} diligenciado
          </span>
          <input
            type="file"
            className="form-control"
            name={!typeFile ? 'sarlaft' : 'habeasData'}
            onChange={(e) => changeTextFile(e, !typeFile)}
            accept={Helpers.fileFormats.join(', ') + ', .docx, .doc'}
          />
          {showDefaultTextFile ? (
            <p>
              Arrastre archivos para adjuntar, o <b>buscar</b>
            </p>
          ) : (
            <p>{textFile}</p>
          )}
          <span>Formatos permitidos PDF, PNG, GIF, JPG</span>
          {fileUrl && (
            <React.Fragment>
              <br />
              <span>
                <a href={fileUrl}>{fileUrl.split('/').slice(-1)}</a>
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
