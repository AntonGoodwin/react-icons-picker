import React from 'react';
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import * as AllIconsLib from './lib'

const PickerModal = ({
    setModalOpen,
    modalEmptyContent,
    searchInputPlaceholder,
    onChange,
    modalFadeStyle,
    modalWrapperStyle,
    searchBarStyle,
    searchInputStyle,
    searchInputFocusStyle,
    modalContentWrapperStyle,
    modalIconsWrapperStyle,
    modalIconsStyle,
    modalIconNameStyle,
    modalIconsHoverStyle,
    modalEmptyWrapperStyle
}) => {

    const [searchValue, setSearchValue] = React.useState('')
    const [watchRequest, setWatchRequest] = React.useState(0)
    const modalContentWrapperRef = React.useRef()
    const searchBarRef = React.useRef()
    const [result, setResult] = React.useState(null)
    const modalFadeRef = React.useRef()
    const searchInputRef = React.useRef()

    React.useEffect(() => {
        if (watchRequest) {
            if (!searchValue) return setResult(null)
            processResult()
        }
    }, [watchRequest])
    React.useEffect(() => {
        calculateModalContentWrapperHeight()
    }, [])
    const calculateModalContentWrapperHeight = () => {
        const target = modalContentWrapperRef.current
        const parent = target.parentElement
        const parentHeight = parent.offsetHeight
        const searchBar = searchBarRef.current
        const searchBarHeight = searchBar.offsetHeight
        target.style.height = parentHeight - searchBarHeight + "px"
    }

    const processResult = async () => {

        const { ...getAllIcons } = AllIconsLib

        let storeAllIcons = {}
        Object.keys(getAllIcons).forEach(iconKey => {
            const { ...tests } = getAllIcons[iconKey]()
            storeAllIcons = { ...storeAllIcons, ...tests }
        })

        const searchResult = {}
        Object.keys(storeAllIcons).forEach(iconName => {
            if (iconName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
                searchResult[iconName] = storeAllIcons[iconName]
            }
        })
        setResult(searchResult)
    }

    const searchInputFocusHandler = () => {
        const target = searchInputRef.current
        Object.keys(searchInputFocusStyle).forEach(styleKey => target.style[styleKey] = searchInputFocusStyle[styleKey])
    }
    const searchInputBlurHandler = () => {
        const target = searchInputRef.current
        Object.keys(searchInputFocusStyle).forEach(styleKey => target.style[styleKey] = 'unset')
        Object.keys(searchInputStyle).forEach(styleKey => target.style[styleKey] = searchInputStyle[styleKey])
    }
    const onKeyDown = (e) => {
        console.log("onKeyDown", e)
        e.stopPropagation();
        e.preventDefault();

        if (e.key === "Enter") {
            setWatchRequest(watchRequest + 1)
        }
    }

    const onKeyPrevent = (e) => {
        console.log("onKeyPrevent", e)
        e.stopPropagation();
        e.preventDefault();
    }

    const handleModalIconsMouseOver = (e) => {
        const target = e.currentTarget
        Object.keys(modalIconsHoverStyle).forEach(styleKey => target.style[styleKey] = modalIconsHoverStyle[styleKey])
    }
    const handleModalIconsMouseOut = (e) => {
        const target = e.currentTarget
        Object.keys(modalIconsHoverStyle).forEach(styleKey => target.style[styleKey] = "unset")
        Object.keys(modalIconsStyle).forEach(styleKey => target.style[styleKey] = modalIconsStyle[styleKey])
    }
    return (
        <div style={modalFadeStyle} className="modalFade" onClick={(e) => e.target === modalFadeRef.current && setModalOpen(false)} ref={modalFadeRef}>
            <div style={modalWrapperStyle} className="modalWrapper">
                <div ref={searchBarRef} style={searchBarStyle} className="searchBar">
                    <BsSearch onClick={() => setWatchRequest(watchRequest + 1)} style={{ cursor: 'pointer' }} />
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyPrevent}
                        onKeyPress={onKeyPrevent}
                        ref={searchInputRef}
                        style={searchInputStyle}
                        className="searchInput"
                        onFocus={searchInputFocusHandler}
                        onBlur={searchInputBlurHandler}
                        placeholder={searchInputPlaceholder ? searchInputPlaceholder : 'Search by pressing "Enter"!!!'}
                    />
                    <AiOutlineClose onClick={() => setModalOpen(false)} style={{ cursor: 'pointer' }} />
                </div>
                <div ref={modalContentWrapperRef} style={modalContentWrapperStyle} className="modalContentWrapper">
                    {result ?
                        <div style={modalIconsWrapperStyle} className="modalIconsWrapper">
                            {Object.keys(result).map(iconKey => {
                                const ThisIcon = result[iconKey]
                                return (
                                    <div style={modalIconsStyle} className="modalIcons" onClick={() => onChange(iconKey)} onMouseOver={handleModalIconsMouseOver} onMouseOut={handleModalIconsMouseOut} key={iconKey}>
                                        <ThisIcon />
                                        <span style={modalIconNameStyle} className="modalIconName">{iconKey}</span>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div style={modalEmptyWrapperStyle} className="modalEmptyWrapper">
                            {modalEmptyContent ? modalEmptyContent : <>
                                <h1>Search for the icon you want...</h1>
                            </>}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default PickerModal;
