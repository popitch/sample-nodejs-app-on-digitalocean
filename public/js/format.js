function numberWithSpaces(x, fixed) {
	x = Number(x);
	fixed = Math.min(Math.max(fixed, 0), 8);
	
    let parts = (fixed ? x.toFixed(fixed) : x.toString()).split(".");
    
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.map(p => p).join(".");
    //return parts.map(p => p.replace(/\B(?=(\d{3})+(?!\d))/g, " ")).join(".");
}
