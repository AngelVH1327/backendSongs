import React, { useState } from 'react';
import { createSong } from '../api';

const SongForm = ({ onSongAdded }) => {
    const [song, setSong] = useState({
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
    const [showForm, setShowForm] = useState(false);
    
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
        // Eliminar etiquetas HTML y JavaScript
        return input.toString().replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);
        
        setSong({ ...song, [name]: sanitizedValue });
        
        // Validar el campo modificado
        const error = validateField(name, sanitizedValue);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
        
        // Validar cada campo
        Object.keys(song).forEach(key => {
            const error = validateField(key, song[key]);
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
        
        // Validar formulario completo
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await createSong(song);
            setSubmitSuccess(true);
            setIsSubmitting(false);
            
            // Resetear el formulario
            setSong({ 
                title: '', 
                artist: '', 
                album: '', 
                genre: '', 
                year: '', 
                duration: '',
                coverImage: ''
            });
            setErrors({});
            
            // Ocultar el formulario después de añadir
            setShowForm(false);
            
            // Notificar al componente padre
            onSongAdded();
            
            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
            
        } catch (error) {
            setIsSubmitting(false);
            if (error.response && error.response.data && error.response.data.errors) {
                // Procesar errores de validación del servidor
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(serverErrors);
            } else {
                setSubmitError('Error al agregar la canción. Inténtalo nuevamente.');
            }
        }
    };

    return (
        <div className="container mt-4">
            {!showForm ? (
                <div className="d-flex justify-content-center mb-4">
                    <button 
                        className="btn btn-success btn-lg" 
                        onClick={() => setShowForm(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i> Añadir Nueva Canción
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-center">Agregar Canción</h2>
                    
                    {submitError && (
                        <div className="alert alert-danger" role="alert">
                            {submitError}
                        </div>
                    )}
                    
                    {submitSuccess && (
                        <div className="alert alert-success" role="alert">
                            ¡Canción agregada con éxito!
                        </div>
                    )}
                    
                    <form className="card p-3 shadow bg-dark text-white" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="title" className="form-label">Título *</label>
                                <input 
                                    type="text" 
                                    id="title"
                                    name="title" 
                                    className={`form-control bg-dark text-white ${errors.title ? 'is-invalid' : ''}`} 
                                    onChange={handleChange} 
                                    value={song.title} 
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
                                    value={song.artist} 
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
                                    value={song.album} 
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
                                    value={song.genre} 
                                    placeholder="Ej: Rock, Pop, Jazz"
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
                                    value={song.year} 
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    placeholder={`1800-${new Date().getFullYear()}`}
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
                                    value={song.duration} 
                                    placeholder="Ej: 3:45" 
                                />
                                {errors.duration && (
                                    <div className="invalid-feedback">
                                        {errors.duration}
                                    </div>
                                )}
                                <small className="form-text text-muted">
                                    Formato: minutos:segundos (m:ss o mm:ss)
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
                                    value={song.coverImage} 
                                    placeholder="https://ejemplo.com/imagen.jpg" 
                                />
                                {errors.coverImage && (
                                    <div className="invalid-feedback">
                                        {errors.coverImage}
                                    </div>
                                )}
                                <small className="form-text text-muted">
                                    URL de la imagen de portada (opcional). Si no se proporciona, se usará una imagen predeterminada.
                                </small>
                            </div>
                            
                            {song.coverImage && isValidURL(song.coverImage) && (
                                <div className="col-md-12 mb-3 text-center">
                                    <label className="form-label">Vista previa:</label>
                                    <div>
                                        <img 
                                            src={song.coverImage} 
                                            alt="Vista previa de portada" 
                                            className="img-thumbnail" 
                                            style={{ maxHeight: '200px' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://placehold.co/400x400/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0) || 'M')}`;
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-2">
                            <small className="text-danger">* Campos obligatorios</small>
                        </div>
                        
                        <div className="d-flex justify-content-between mt-3">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
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
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Procesando...
                                    </>
                                ) : 'Agregar Canción'}
                            </button>
                        </div>
                    </form>
                </>
            )}
            
            {submitSuccess && (
                <div className="alert alert-success mt-3" role="alert">
                    ¡Canción agregada con éxito!
                </div>
            )}
        </div>
    );
};

export default SongForm;