import React, { useState, useEffect } from 'react';
import { updateSong } from '../api';

const EditSongForm = ({ song, onClose, onSongUpdated }) => {
    const [formData, setSong] = useState({
        title: '', 
        artist: '', 
        album: '', 
        genre: '', 
        year: '', 
        duration: '',
        coverImage: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Inicializar formulario con datos de la canción
        setSong({
            title: song.title || '',
            artist: song.artist || '',
            album: song.album || '',
            genre: song.genre || '',
            year: song.year || '',
            duration: song.duration || '',
            coverImage: song.coverImage || ''
        });
        
        // Animar entrada
        setTimeout(() => {
            setIsVisible(true);
        }, 50);
    }, [song]);
    
    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                if (!value.trim()) return 'El título es obligatorio';
                if (value.length > 100) return 'El título no puede exceder 100 caracteres';
                return '';
            
            case 'artist':
                if (!value.trim()) return 'El artista es obligatorio';
                if (value.length > 100) return 'El nombre del artista no puede exceder 100 caracteres';
                return '';
            
            case 'album':
                if (value.length > 100) return 'El nombre del álbum no puede exceder 100 caracteres';
                return '';
            
            case 'genre':
                if (value.length > 50) return 'El género no puede exceder 50 caracteres';
                if (/^\d+$/.test(value)) return 'El género no puede ser solo números';
                return '';
            
            case 'year':
                if (value && isNaN(value)) return 'El año debe ser un número';
                if (value && (parseInt(value) < 1800 || parseInt(value) > new Date().getFullYear())) {
                    return `El año debe estar entre 1800 y ${new Date().getFullYear()}`;
                }
                return '';
            
            case 'duration':
                if (value && !/^([0-9]|[1-9][0-9]):([0-5][0-9])$/.test(value)) {
                    return 'El formato debe ser m:ss o mm:ss (ej: 3:45)';
                }
                return '';
            
            case 'coverImage':
                if (value && !isValidURL(value)) {
                    return 'Debe ser una URL válida de imagen';
                }
                return '';
            
            default:
                return '';
        }
    };
    
    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    
    const sanitizeInput = (input) => {
        return input.toString().replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);
        
        setSong({ ...formData, [name]: sanitizedValue });
        
        const error = validateField(name, sanitizedValue);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
        
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                formErrors[key] = error;
                isValid = false;
            }
        });
        
        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess(false);
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await updateSong(song._id, formData);
            setSubmitSuccess(true);
            setIsSubmitting(false);
            
            // Notificar al componente padre
            if (onSongUpdated) {
                onSongUpdated();
            }
            
            // Cerrar después de actualizar
            setTimeout(() => {
                handleClose();
            }, 1500);
            
        } catch (error) {
            setIsSubmitting(false);
            setSubmitError('Error al actualizar la canción. Inténtalo nuevamente.');
        }
    };
    
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    return (
        <div 
            className="modal-backdrop show fixed-top fixed-bottom d-flex align-items-center justify-content-center" 
            style={{ 
                background: 'rgba(0,0,0,0.85)', 
                backdropFilter: 'blur(8px)',
                transition: 'opacity 0.3s ease-in-out',
                opacity: isVisible ? 1 : 0,
                zIndex: 1060
            }}
            onClick={handleClose}
        >
            <div 
                className="modal-dialog modal-lg" 
                style={{ 
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
                    opacity: isVisible ? 1 : 0,
                    maxWidth: '800px',
                    width: '100%'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-content bg-dark text-white border-0 shadow-lg">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title">
                            <i className="bi bi-pencil-square me-2"></i>
                            Editar Canción
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>
                    
                    <div className="modal-body">
                        {submitError && (
                            <div className="alert alert-danger animate__animated animate__fadeIn" role="alert">
                                {submitError}
                            </div>
                        )}
                        
                        {submitSuccess && (
                            <div className="alert alert-success animate__animated animate__fadeIn" role="alert">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                ¡Canción actualizada con éxito!
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="title" className="form-label">Título *</label>
                                    <input 
                                        type="text" 
                                        id="title"
                                        name="title" 
                                        className={`form-control bg-dark text-white ${errors.title ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.title} 
                                        required 
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="artist" className="form-label">Artista *</label>
                                    <input 
                                        type="text" 
                                        id="artist"
                                        name="artist" 
                                        className={`form-control bg-dark text-white ${errors.artist ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.artist} 
                                        required 
                                    />
                                    {errors.artist && (
                                        <div className="invalid-feedback">
                                            {errors.artist}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="album" className="form-label">Álbum</label>
                                    <input 
                                        type="text" 
                                        id="album"
                                        name="album" 
                                        className={`form-control bg-dark text-white ${errors.album ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.album} 
                                    />
                                    {errors.album && (
                                        <div className="invalid-feedback">
                                            {errors.album}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="genre" className="form-label">Género</label>
                                    <input 
                                        type="text" 
                                        id="genre"
                                        name="genre" 
                                        className={`form-control bg-dark text-white ${errors.genre ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.genre} 
                                    />
                                    {errors.genre && (
                                        <div className="invalid-feedback">
                                            {errors.genre}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="year" className="form-label">Año</label>
                                    <input 
                                        type="number" 
                                        id="year"
                                        name="year" 
                                        className={`form-control bg-dark text-white ${errors.year ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.year} 
                                    />
                                    {errors.year && (
                                        <div className="invalid-feedback">
                                            {errors.year}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="duration" className="form-label">Duración</label>
                                    <input 
                                        type="text" 
                                        id="duration"
                                        name="duration" 
                                        className={`form-control bg-dark text-white ${errors.duration ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.duration} 
                                    />
                                    {errors.duration && (
                                        <div className="invalid-feedback">
                                            {errors.duration}
                                        </div>
                                    )}
                                    <small className="form-text text-muted">
                                        Formato: m:ss o mm:ss (ej: 3:45)
                                    </small>
                                </div>
                                
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="coverImage" className="form-label">URL de Portada</label>
                                    <input 
                                        type="url" 
                                        id="coverImage"
                                        name="coverImage" 
                                        className={`form-control bg-dark text-white ${errors.coverImage ? 'is-invalid' : ''}`} 
                                        onChange={handleChange} 
                                        value={formData.coverImage} 
                                    />
                                    {errors.coverImage && (
                                        <div className="invalid-feedback">
                                            {errors.coverImage}
                                        </div>
                                    )}
                                </div>
                                
                                {formData.coverImage && isValidURL(formData.coverImage) && (
                                    <div className="col-md-12 mb-3 text-center">
                                        <label className="form-label">Vista previa:</label>
                                        <div>
                                            <img 
                                                src={formData.coverImage} 
                                                alt="Vista previa de portada" 
                                                className="img-thumbnail" 
                                                style={{ maxHeight: '200px' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/400x400/1DB954/FFFFFF?text=${encodeURIComponent(formData.title.charAt(0) || 'M')}`;
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-2">
                                <small className="text-danger">* Campos obligatorios</small>
                            </div>
                            
                            <div className="modal-footer border-secondary mt-4">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={handleClose}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Guardando...</span>
                                            </div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-2"></i>
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSongForm;