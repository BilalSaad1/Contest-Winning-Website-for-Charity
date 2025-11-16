import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth/mammoth.browser';
import "./forms.css";

const predefinedForms = [
    { name: 'Photo and Video Consent Form', additionalData: {} },
    { name: 'Participant Profile', additionalData: {} },
    { name: 'Rules & Guidelines', additionalData: {} },
    { name: 'Code of Conduct', additionalData: {} },
    { name: 'Emergency Contact Form', additionalData: {} },
];

function App() {
    const [forms, setForms] = useState(predefinedForms);
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
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
        fetchFormDetails();
    }, []);

    const downloadDocxFile = (formName) => {
        const form = forms.find(f => f.name === formName);
        if (form && form.additionalData.data) {
            const uint8Array = new Uint8Array(form.additionalData.data);
            const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${formName.replace(/\s+/g, '_')}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert('No document available for download.');
        }
    };

    const convertDocxToHtml = async (formName) => {
        try {
            const form = forms.find(f => f.name === formName);
            if (form && Object.keys(form.additionalData).length !== 0) {
                const arrayBuffer = new Uint8Array(form.additionalData.data).buffer;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                console.log(result)
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
                    <button className="formApp_downloadButton" onClick={() => downloadDocxFile(form.name)}>Download {form.name}</button>
                    <button className="formApp_viewButton" onClick={() => convertDocxToHtml(form.name)}>View {form.name}</button>
                </div>
            ))}
            {htmlContent && <div className="formApp_htmlContent" dangerouslySetInnerHTML={{ __html: htmlContent }} />}
        </div>
    );
}

export default App;





