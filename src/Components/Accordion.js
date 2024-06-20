import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

export default function AccordionComponent(props) {
   const {title} = props
  return (
    <div>
     <Accordion sx={{ border: 'none' }}>
        <AccordionSummary
         aria-controls="panel1-content"
        id="panel1-header"
        color='#ef5350'
        className=''
        >
           {title}
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      
  
    </div>
  );
}