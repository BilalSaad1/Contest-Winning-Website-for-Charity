import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth/mammoth.browser';
import "./forms.css"

// Predefined forms with a minimal structure. 
// Could be extended with more properties as required.
const predefinedForms = [
    { name: 'Photo and Video Consent Form', additionalData: {} },
    { name: 'Participant Profile', additionalData: {} },
    { name: 'Rules & Guidelines', additionalData: {} },
    { name: 'Code of Conduct', additionalData: {} },
    { name: 'Emergency Contact Form', additionalData: {} }, // Example of a fifth form
];

function App() {
    const [forms, setForms] = useState(predefinedForms);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [htmlContent, setHtmlContent] = useState('');

    const fetchFormDetails = async () => {
        try {
            const response = await fetch('/api/forms');
            const data = await response.json();
            const updatedForms = forms.map(form => {
                const additionalData = data.find(d => d.name === form.name)?.docxFile || {};
                return { ...form, additionalData };
            });
            setForms(updatedForms);
        } catch (error) {
            console.error('Error fetching form details:', error);
        }
    };

    useEffect(() => {
        fetchFormDetails();
    }, []);

    const handleFileChange = (event, formName) => {
        setSelectedFiles({
            ...selectedFiles,
            [formName]: event.target.files[0],
        });
    };

    const handleUpload = async (formName) => {
        const file = selectedFiles[formName];
        if (!file) {
            alert(`Please select a file for ${formName} first!`);
            return;
        }
        const formData = new FormData();
        console.log(file);
        formData.append('form', file);
        formData.append('name', formName);
        try {
            const response = await fetch(`/api/upload/${formName}`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.text();
            fetchFormDetails();
            alert(result);
        } catch (error) {
            console.log('Error uploading the file', error);
            alert('Error uploading the file');
        }
    };

    const downloadDocxFile = () => {
        const uint8Array = new Uint8Array(forms[0].additionalData.data);
        const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const convertDocxToHtml = async (formName) => {
        try {
            const index = forms.findIndex(form => form.name === formName);
            console.log(forms[index].additionalData);
            if (Object.keys(forms[index].additionalData).length !== 0) {
                const arrayBuffer = new Uint8Array(forms[index].additionalData.data).buffer;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                console.log(result.value);
                setHtmlContent(result.value);
            } else {
                setHtmlContent('There is no form uploaded');
            }
        } catch (error) {
            console.error('Error converting .docx to HTML:', error);
        }
    };

    return (
        <div className="formApp_container">
            {forms.map((form, index) => (
                <div key={index} className="formApp_formGroup">
                    <label className="formApp_label">{form.name}</label>
                    <input
                        type="file"
                        className="formApp_input"
                        onChange={(e) => handleFileChange(e, form.name)}
                    />
                    <button className="formApp_uploadButton" onClick={() => handleUpload(form.name)}>Upload {form.name}</button>
                    <button className="formApp_viewButton" onClick={() => convertDocxToHtml(form.name)}>View {form.name}</button>
                </div>
            ))}
            {htmlContent && <div className="formApp_htmlContent" dangerouslySetInnerHTML={{ __html: htmlContent }} />}
        </div>
    );
}

export default App;






