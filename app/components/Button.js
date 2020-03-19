import React from 'react'

import styles from './Button.css'

export default ({className="", children, ...props}) => (
	<button className={`${styles.button} ${className}`} {...props}>{children}</button>
)
