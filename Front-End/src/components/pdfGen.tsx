
import React from 'react';
type typesProps = {
    text: string
}
function PdfGen(props: typesProps) {
    
    return (
        <div>
            <h1>omar khabou</h1>
            <div>{props.text}</div>
        </div>
    )
}
export default PdfGen;