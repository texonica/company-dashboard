'use client'

import React, { ReactNode, useState } from 'react';

interface PopoverRootProps {
    children: ReactNode;
    className?: string;
}

export function Popover({ children, className = '' }: PopoverRootProps) {
    return (
        <div className={`relative inline-block ${className}`}>
            {children}
        </div>
    );
}

interface PopoverTriggerProps {
    children: ReactNode;
    onClick?: () => void;
}

export function PopoverTrigger({ children, onClick }: PopoverTriggerProps) {
    return (
        <div 
            className="cursor-pointer" 
            onClick={onClick}
        >
            {children}
        </div>
    );
}

interface PopoverContentProps {
    children: ReactNode;
    className?: string;
    align?: 'start' | 'center' | 'end';
}

export function PopoverContent({ children, className = '', align = 'center' }: PopoverContentProps) {    
    const alignClass = 
        align === 'start' ? 'left-0' : 
        align === 'end' ? 'right-0' : 
        'left-1/2 transform -translate-x-1/2';
    
    return (
        <div 
            className={`absolute z-50 mt-1 ${alignClass} bg-white border rounded-md shadow-lg ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
} 