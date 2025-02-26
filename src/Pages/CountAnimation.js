import { useEffect, useState } from "react";

const CountAnimation = (target, duration = 2000) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (target === undefined || target === null) return;

		let start = 0;
		const increment = target / (duration / 16);

		const animate = () => {
			start += increment;
			if (start < target) {
				setCount(Math.ceil(start));
				requestAnimationFrame(animate);
			} else {
				setCount(target);
			}
		};

		animate();
	}, [target, duration]);

	return count.toLocaleString();
};

export default CountAnimation;
