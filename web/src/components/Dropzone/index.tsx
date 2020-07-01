import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiImage } from 'react-icons/fi';

import './styles.css';

interface Props {
	onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('');

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0];
		const fileUrl = URL.createObjectURL(file);

		setSelectedFileUrl(fileUrl);
		onFileUploaded(file);
	}, [onFileUploaded])
	
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
		onDrop,
		accept: 'image/*'
	})

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      
			{ selectedFileUrl ?
				<div className="imgContainer">
					<img src={selectedFileUrl} alt="Point Thumbnail"/>					
					<div className="imgCover">
						<FiUpload className="newIcon"/>
						<span>Clique para selecionar uma nova imagem!</span>
					</div>
				</div>
			: (
				isDragActive ?
					<div className="noImage">
						<FiImage className="icon"/>
						<p>Solte o arquivo...</p>
					</div>
				:
					<div className="noImage">
						<FiUpload className="icon"/>					
						<p>Arraste a <span className="boldText"> imagem do estabelecimento </span> aqui<br/> ou clique para selecionar!</p>
					</div>
				)
			}
			
			
    </div>
  )
}

export default Dropzone;